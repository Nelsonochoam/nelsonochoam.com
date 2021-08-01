---
title: To branch or not to branch?
date: "2021-08-01T22:12:03.284Z"
description: "Pushing directly to master?"
tags: ["Design"]
---

</br>
</br>

<img src="./branches.png"  style="width:300px; max-height: 300px;"/>

</br>
</br>
</br>

The topic of branching can be really controversial. I have worked on different companies with different teams and not all strategies work for every culture. I wanted to share my experience working with different branching strategies used by some teams I have worked with in the past, and why I think having no branches is a solid strategy (yes pushing directly to master)

### The problem with branching

As soon as we create a branch and add our first commit, we start diverging away from the code that is in master. Now add to that the fact that most likely you are not the only one working in the codebase. Each developer is working on something different and while they are working on their features your code doesn't reflect their changes and their code doesn't reflect your changes.

- When teams start working with branches there is added complexity. Most of the companies I have worked with end up having to maintain branches for every environment testing, development, staging, production, demo.

- While each developer works on their branch you can't see what other developers are working on until they merge their branch to master. Someone might decide some old code needed refactoring and that totally messes up everything you have been working on and you have to spend a day fixing merge conflicts. Once you finally fixed everything, you pull master again and \*\*\*k (blip) some other developer pushed something else and you are back to fixing more merge conflicts.

- Most likely if your team is using branches they don't push small commits constantly into master (does your team integrates their code into master 2, 3 or more times a day?). I am sure most likely your branch doesn't get merged to master until your feature is "complete".

- You might end up with some weird branches that do not represent what your actual product can do. Have you ever had those situations where you had to build something in one night just to make a sale? (that pesky demo branch).

- No, you are not doing Continuous Integration if you aren't able to integrate code into your product continually. The goal of CI is working so that our changes are always visible to at least our teammates. If you are really doing CI there should only be one significant version of you code.

---

<br/>

I am not saying branches can't work but generally what I described above is what ends up happening most of the time. If you use branches but integrate those branches into your master really frequently (even if the feature is not complete), then sure go crazy.

Also branches can be used for releases once you are stastfied with the code at a specific commit and create a release build off of them (if you were creating builds or releasable artifacts every commit you wouldn't need this though)

Dave Farley, Co-Author of the book Continuous Delivery explains this in greater detail on his youtube channel

`youtube:https://www.youtube.com/watch?v=lXQEi1O5IOI`

####Don't branch

This is not something crazy that I am inventing or a new idea I created. Large multimillion dollars corporations have been doing this for years ([Google for instance](https://trunkbaseddevelopment.com/game-changers/index.html#google-revealing-their-monorepo-trunk-2016])). This style of development is called [Trunk Based Development](https://trunkbaseddevelopment.com/) (Check that link which has TONS of information on this topic).

Achieving the goal of not having to branch and actually doing continuous integration and eventually continuous delivery requires your team to structure code in a certain way, here are a few things that need to happen:

- It is **imperative** that your teams have solid testing practices. Having a solid testing suite will enable you to push code into master (trunk) and know if it breaks some of the existing functionality. (I would suggest learning TDD for this). The added bonus of this (_aside from having to think less about branches_) is that you will naturally have less bugs (_at least the regression ones_).

- Merging directly to master doesn't mean no code reviews, your team should still be diligent ensuring code quality. (I personally prefer doing pair programming than doing the back and forth dance on Github, Bitbucket, etc for code reviews, but that is besides the point)

- Your team must be ok merging in code that is not complete (_by incomplete I don't mean half written_). All code merged in should be production quality and tested but the feature might not be fully complete. You could merge in as soon as you finish writing a piece of code that is passing the test that you just wrote and not breaking any of the other tests. There are ways to hide incomplete features from users using a single branch using strategies like

  - Feature toggles/flags
  - [Dark Launches](https://launchdarkly.com/blog/guide-to-dark-launching/)
  - [Branch by Abstraction](https://martinfowler.com/bliki/BranchByAbstraction.html)

- Separate integration from deployment. Merging into master doesn't mean realeasing into production. You should be able to deploy the same branch into different environments and decide when to move a release artifact into production.

- Have a sound strategy for rolling back to a previous system state if things go wrong, because we are humans and we might ocassionally mess up.

### In Summary

There are many ways to skin a cat and as humans we all have different preferences. I have worked with different strategies such as the [Github Flow](https://guides.github.com/introduction/flow/) which comes really close to **Trunk Based Development**, Feature Branching, No Branching. The reason I have liked more the no branching strategy is that

- It simplifies managing your code.
- You have more visibility on what code changes other developers are making since you are constantly merging to master and so are other developers.
- Merge conflicts become tiny if any.
- Reduces bugs and the cost of QA on regressions.
- Enforces a culture around quality. Your teams and company need to be able to relly on tests to know if the software still works after a change is made.
- Eventually, it will make it easier to reach continuous delivery were you could release any time you wanted and not at the end of every sprint.

There is a learning curve to get to no branching and it requires discipline and support from the business to ensure people are doing small commits, being thorough on code reviews and most importantly writting tests and aggresively testing the app.

### Resources

- https://launchdarkly.com/blog/guide-to-dark-launching/
- https://trunkbaseddevelopment.com/
- https://www.youtube.com/watch?v=v4Ijkq6Myfc
- https://www.youtube.com/watch?v=lXQEi1O5IOI
- https://www.amazon.ca/Continuous-Delivery-Reliable-Deployment-Automation/dp/0321601912
