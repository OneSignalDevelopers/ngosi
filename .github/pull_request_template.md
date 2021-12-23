⚠️ Click preview button above ⚠️

# PR Template

1. Apply relevant labels.
1. Self-review code and PR.
1. Request review from a team member.
1. Wait for the code review.
1. Take the bits that apply to your PR and delete the rest of template.

---

## Solution

- Describe **how** your solution works and solves the problem. Speak to your design and the approach taken in the implementation.
- Call out any assumptions and key decisions made while solving the issue.
- Call out changes that may lead to deployment failure
  - new or updated test specs
  - dependency and other package updates (use label and link to dependency docs)
  - new migrations (use label)
  - devOps changes (use label)

```md
###### Thing your're calling out

The thing being called out. Use a list when it makes sense.
```

## Testing

Provide a test plan made up of a sorted list of discrete steps with expected outcomes the reviewer should expect. If the functionality that needs to be tested seems complicated to explain, including a short video in the resources section or offer to pair on the review.

```md
1. Install the new depedency by running, `yarn`
2. Start the app, `yarn dev`
3. Submit a request to some endpoint
4. Observe stuff works!
```

## Resources

Provide supporing content to help the reviewer review your PR. Content can include a mix of videos, gifs, images, and deep links (e.g., figma design resource, code snippets, messages, etc).

```md
###### Short description of video

[video](#video/)

###### Short description of Gif

![gif](#gif/)

###### Short description of image

![image](#url/)

###### Short description of code snippet

Github perma link will be rendered as a code snippet

### Links

Bulleted list of deep links to things like figma, messages,

- [Short description of deep link](#deep-link/)
- [Designs in Figma](#figma-deep-link)
- [Something in Gdrive](#gdrive-link)
- [Get the idea?](#deep-link)

### References

Bulleted list of references used to implement the solution presented in this PR.

- [Short description of what's being linked to](#the-link/)
```
