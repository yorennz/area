
import * as dotenv from 'dotenv';
dotenv.config()
export default () => ({
  notion: {
    client_id: process.env.NOTION_CLIENT_ID,
    client_secret: process.env.NOTION_CLIENT_SECRET,
    loginScope: [
      'identify',
      'email',
    ].join(" "),
    authorizationScope: [
      'identify',
      'email',
      'connections',
    ].join(" "),
    oauth2: {
      token_url: process.env.NOTION_TOKEN_URL,
      authorization_url: process.env.NOTION_AUTH_URL,
    },

    // Discord Service Action Reaction
    service: {
      name: 'notion',
      actions: [
        { // 0
          name: 'title_page_trigger',
          description: 'trigger when the title of the page is changed',
          data: {
            page_id: "The id of the page you want to trigger",
          }
        },
        { // 1
          name: 'icon_page_trigger',
          description: 'trigger when the icon of the page is changed',
          data: {
            page_id: "The id of the page you want to trigger",
          }
        },
        {// 2
          name: 'specific_title_page_trigger',
          description: 'trigger when the title of the page is equal to your input',
          data: {
            page_id: "The id of the page you want to trigger",
            title: "The title that you want to trigger"
          }
        },
        { // 3
          name: 'specific_icon_page_trigger',
          description: 'trigger when the icon of the page is equal to your input',
          data: {
            page_id: "The id of the page you want to trigger",
            icon: "The icon that you want to trigger"
          }
        },
        {// 4
          name: 'page_content_trigger',
          description: 'trigger when the content of your page change',
          data: {
            page_id: "The id of the page you want to trigger",
          }
        },
        {// 5
          name: 'specific_page_content_trigger',
          description: 'trigger when the content of your page is equal to your input',
          data: {
            page_id: "The id of the page you want to trigger",
            content: "The content that you want to trigger"
          }
        },
        {// 6
          name: 'page_cover_trigger',
          description: 'trigger when the cover of your page change',
          data: {
            page_id: "The id of the page you want to trigger",
          }
        },
        {// 7
          name: 'specific_page_cover_trigger',
          description: 'trigger when the cover of your page is equal to your input url',
          data: {
            page_id: "The id of the page you want to trigger",
            url: "The image url that you want to trigger"
          }
        },
        {// 8
          name: 'new_comment_on_page_triger',
          description: 'trigger when there is a new comment in your page',
          data: {
            page_id: "The id of the page you want to trigger",
          }
        },
        {// 9
          name: 'specific_new_comment_on_page_triger',
          description: 'trigger when the new comment is equal to your input',
          data: {
            page_id: "The id of the page you want to trigger",
            input: "The comment you want to trigger"
          }
        },
      ],
      reactions: [
        { // 0
          name: 'post_comment',
          description: 'Post a comment inside a page',
          data: {
            page_id: "The id of the page you want to post comment",
            comment: "The content of your comment",
            url: "Add a url to your comment *optional*",
            color: "The color of your comment *optional*",
            bold: "bold - Style of the comment Default: false *boolean**optional*",
            underline: "underline - Style of the comment Default: false *boolean**optional*",
            italic: "italic - Style of the comment Default: false *boolean**optional*",
          }
        },
        { // 1
          name: 'create_page_in_parent',
          description: 'Create a page inside a parent page',
          data: {
            page_id: "The id of parent page",
            title: "The title of your page",
            title_url: "Add a url to your title *optional*",
            image_url: "The url image if you want a background image for your page *optional*",
            icon: "The icon for the page *optional*"
          }
        },
        { // 2
          name: 'create_block_in_page',
          description: 'Create a block within a page',
          data: {
            page_id: "The id of the page or a block",
            title: "The title of your block",
            title_url: "Add a url to your title *optional*",
            title_color: "The color of your title *optional*",
            title_bold: "title_bold - Style of the title Default: false *boolean**optional*",
            title_underline: "title_underline - Style of the title Default: false *boolean**optional*",
            title_italic: "title_italic - Style of the title Default: false *boolean**optional*",
            content: "The content of the block",
            content_url: "Add a url to your content *optional*",
            content_color: "The color of your content *optional*",
            content_bold: "content_bold - Style of the content Default: false *boolean**optional*",
            content_underline: "content_underline - Style of the content Default: false *boolean**optional*",
            content_italic: "content_italic - Style of the content Default: false *boolean**optional*",
          }
        },
        { // 3
          name: 'update_block_title',
          description: 'Update a only title block',
          data: {
            block_id: "The id of the block",
            title: "The new title of your block",
            title_url: "Add a url to your title *optional*",
            title_color: "The color of your title *optional*",
            title_bold: "title_bold - Style of the title Default: false *boolean**optional*",
            title_underline: "title_underline - Style of the title Default: false *boolean**optional*",
            title_italic: "title_italic - Style of the title Default: false *boolean**optional*",
          }
        },
        { // 4
          name: 'delete_block_or_page',
          description: 'Delete a block or page',
          data: {
            id: "The id of the block / page you want to delete",
          }
        },
      ],
    }
  },
});