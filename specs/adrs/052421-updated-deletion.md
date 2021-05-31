# How to Delete Entries - [Updated decision](052321-deletion-method.md)
* Status: Accepted
* Deciders: Asya, Praneet, Ryan (with strong recommendation from Sanat)
* Date: 2021-05-24



## Context and Problem Statement
As a team we had previously decided that we didn't need a delete button for the user to delete a bullet.
​

## Decision Drivers

* Feedback from Sanat suggested that we keep what we had *and* implement a delete button
​

## Considered Options

* Not creating a button and sticking with what we had before as the only delete option (hitting backspace when `bullet-text` was empty)
* Creating the button for each bullet element
​

## Decision Outcome
Chosen option: "creating the button", because
​
* it makes our application easier to use for the user
* the delete button is more intuitive than hitting backspace when `bullet-text` is empty
* provides the user with multiple ways to edit their journal