# Get meeting topic (blank is fine), then figure out what to name the file based off date and topic
$strTopic        = Read-Host "Meeting Topic";
if ($strTopic) {
    $strFileName = "{0}-{1}.md" -f (Get-Date -Format "MMddyy"), ($strTopic -replace ' ', '_');
} else {
    $strFileName = "{0}.md" -f (Get-Date -Format "MMddyy");
}

# Setup each line of the template 
$strMeetingTopic = "# Team 10 $strTopic Meeting";
$strDate         = "### Date: {0}" -f (Get-Date -Format "dddd, MMMM dd");
$strTime         = "### Meeting Start Time: {0} PST" -f (Get-Date -Format "h:mm tt");
$strLocation     = "### Location: Zoom";
$strPresent      = "### Present: ";
$strAbsent       = "### Absent: ";
$strDiscussion   = "## Discussion Points`n-";
$strActionItems  = "## Action Items`n-";
$strEndTime      = "## Meeting End Time: ";

# Figure out who's here and who's not as easily as possible
# - Just mark down who's here and the automation will mark the rest as absent
$arrMembers      = ('Akar', 'Akhilan', 'Asya', 'Brian', 'Huy', 'Ivan', 'Nathan', 'Praneet', 'Ryan', 'Sanat');

Write-Output "`nNote down who's present, one by one";
Write-Output "Members: `n$arrMembers`n";
$strInput        = Read-Host "Present member";

$arrPresent      = [System.Collections.ArrayList]@();
while ($strInput) {
    $arrPresent.Add($strInput) | Out-Null;
    $strInput    = Read-Host "Present member";
}

# Iterate through all members, comparing against list of present to figure out
#   which line to put them under (Absent vs Present)
$boolFirstAbs    = $True;
$boolFirstPres   = $True;
$arrMembers | ForEach-Object {
    if ($arrPresent -contains $_) {
        if ($boolFirstPres) {
            $strPresent += $_;
            $boolFirstPres = $False;
        } else {
            $strPresent += ", $_";
        }
    } else {
        if ($boolFirstAbs) {
            $strAbsent += $_;
            $boolFirstAbs = $FALSE;
        } else {
            $strAbsent += ", $_";
        }
    }
}

# Combine all the lines togther and write the template output to file
$strTemplateContent = "$strMeetingTopic`n$strDate`n$strTime`n$strLocation`n$strPresent`n$strAbsent`n$strDiscussion`n$strActionItems`n$strEndTime";
Out-File -NoNewLine -InputObject $strTemplateContent $strFileName;

# Attempt to open up VSC to the template and exit the script
(& "$env:localappdata\Programs\Microsoft VS Code\Code.exe" $strFileName)&;
