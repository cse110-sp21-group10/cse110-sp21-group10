# How to Delete Entries
* Status: Accepted
* Deciders: Asya, Akar, Akhil, Brian, Ivan, Praneet, Ryan
* Date: 2021-05-23
* Updated decision: 2021-05-24
​

## Context and Problem Statement
Users may not want to keep all of the notes they created/may have created a bullet on accident and 
don't want it, so how could they delete it?
​

## Decision Drivers

* We want something that feels intuitive to the user.
* We also want something that fits with the UI we have so far.
​

## Considered Options

* Using the backspace button when the `bullet-text` element is empty
* Having a delete button
​

## Decision Outcome
Chosen option: "Backspace Button", because
​
* it seems intuitive that if you tried to hit backspace on an empty bullet it would delete itself
* A button could create too much clutter
* is a non-clickable option (like the VIM-esque shortcuts we discussed in the beginning)
