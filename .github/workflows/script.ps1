# Define base variables
$strOrgName     = 'cse110-sp21-group10';
$strRepoName    = $strOrgName;
$strBaseURL     = ('https://api.github.com/repos/{0}/{1}' -f $strOrgName, $strRepoName);

# Generate credentials from username and token
$strCred        = ('{0}:{1}' -f 'maniacalhamster', $env:PERSONAL_TOKEN);
$strAuthEncrypt = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes($strCred));
$strAuthBody    = ('Basic {0}' -f $strAuthEncrypt);
$objHeader      = @{'Authorization'=$strAuthBody};

# Set the number of required approvals
$numReqApprovals = $env:APPROVALS;

# Define helper function for making requests
function makeRequest($strURL) {
    Write-Information "Making call to: $strURL";

    Invoke-RestMethod -Headers $objHeader -Uri $strURL;
}

# Define helper function to get open pull requests
function getPulls() {
    Write-Information "`t - Retreiving pull requests"

    $strPullsURL = "$strBaseURL/pulls";

    makeRequest $strPullsURL;
}

# Define a helper function to figure what label to apply based off user
# - Uses a hashmap (group -> members, label) stored in a json file
function determineLabel($strUsername) {
    if (!$objTeams) {
        Write-Information 'Reading team info from file...';
        Set-Variable -Name objTeams -Scope Global -Value $(Get-Content '.\.github\workflows\teams.json' | ConvertFrom-Json);
    }

    (Get-Member -InputObject $objTeams -MemberType NoteProperty).Name | ForEach-Object {
        if ($objTeams.$_.members -contains $strUsername) {
            return $objTeams.$_.label;
        }
    }
}

# Define a helper function to apply label to a PR (via issue url)
function applyLabel($strIssueURL, $numPullReqNum, $strLabel){
    Write-Information "`t - Applying label <$strLabel> to PR #$numPullReqNum";

    $strLabelURL = "$strIssueURL/labels";
    $objBody = ConvertTo-Json @($strLabel);

    Invoke-RestMethod -Method Post -Body $objBody -Headers $objHeader -Uri $strLabelURL;
}

# Define a helper function to merge pull requests
function mergePull($strPullReqURL, $numPullReqNum) {
    Write-Information "`t - Merging pull request #$numPullReqNum";
    $strMergeURL = "$strPullReqURL/merge";

    Invoke-RestMethod -Method Put -Headers $objHeader -Uri $strMergeURL;
}

# For each open pull request:
#   - Grab reviews, and for each:
#       - Check review type for approvals
#       - Find the group associated with each approval and apply the right label
#       - Increment the approval count for each approval
#   - Finally check if PR has enough appprovals and merge
$arrPullRequests = getPulls;

$arrPullRequests | ForEach-Object {
    $strPullReqURL  = $_.url;
    $strIssueURL    = $_.issue_url;
    $numPullReqNum  = $_.number;
    $numApprovals   = 0;
    $arrReviews     = makeRequest "$strPullReqURL/reviews";

    $arrReviews | ForEach-Object {
        if ($_.State -Match "Approved") {
            $strLabel   = determineLabel $_.user.login;
            applyLabel -strIssueURL $strIssueURL -numPullReqNum $numPullReqNum -strLabel $strLabel;
            $numApprovals++;
        }
    }

    if ($numApprovals -ge $numReqApprovals) {
        mergePull $strPullReqURL $numPullReqNum;
    }
}
