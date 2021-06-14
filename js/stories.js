"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;
let favoriteList;

/** Get and show stories when site first loads. */
async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  putStoriesOnPage();
}


async function getAndShowFavoritesOnStart(story, htmlStory) {
  favoriteList = await User.getFavorites();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        <button class="favorite">save story</button>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

async function putStoriesOnPage() {
  $allStoriesList.empty();
  
  await getAndShowFavoritesOnStart();
  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    for (let favorite of currentUser.favorites) {
      if (story.storyId === favorite.storyId) {
        $story[0].children[4].classList.add("saved-favorite")
      };
    };

    $allStoriesList.append($story);
  };

  $allStoriesList.show();
}


async function addNewStory(evt) {
  evt.preventDefault();

  const author = $("#new-story-author").val();
  const title = $("#new-story-title").val();
  const url = $("#new-story-url").val();
  const username = currentUser.username;

  let newStory = {author, title, url, username};
  const story = await StoryList.addStory(currentUser, newStory);
  
  getAndShowStoriesOnStart();
  $navSubmit.trigger("reset");
}

$newStoryForm.on("submit", addNewStory);
