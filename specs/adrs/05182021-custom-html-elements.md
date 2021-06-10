# Chose to store the bullets and logs as custom html elements
* Status: Accepted
* Deciders: Asya, Akar, Akhil, Brian, Huy, Nathan, Praneet, Ryan
* Date: 2021-05-18
​

## Context and Problem Statement
We need to implement the bullets and logs in the html, but we needed to be able to insert and remove the elements flexibly when navigating usign the SPA. We also need elements that are easy to edit. 

Do we regular list elements and edit them using CSS or do we use custom html elements?

## Decision Drivers

* Custom elements are much more flexible
* If we did not use custom HTML elements, there will likely be more trouble switching out the content
* Custom HTML elements are hard to orgainze into a grid
​

## Considered Options

* Use the given HTML elements, which is simpler, but less flexible
* Use custom html elements, which are more complex but more flexible and likely work better with the SPA

## Decision Outcome
Chosen option: "Custom HTML elements", because
​
* Custom HTML elements are more flexible and make it easier to change out content
* Some bullets are not just lists, and as a result, a simple list element can't encapsulate all behavior
