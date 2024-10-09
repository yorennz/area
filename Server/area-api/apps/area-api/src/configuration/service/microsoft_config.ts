import * as dotenv from 'dotenv';
dotenv.config()
export default () => ({
  microsoft: {
    client_id: process.env.MICROSOFT_CLIENT_ID,
    client_secret: process.env.MICROSOFT_CLIENT_SECRET,
    locataire_id: process.env.MICROSOFT_TENANT_ID,
    loginScope: [
      "email",
      "openid",
      "profile",
      "offline_access",
      ].join(" "),
    authorizationScope: [
      'https://graph.microsoft.com/User.Read',
      "email",
      "openid",
      "profile",
      "offline_access",
      "https://graph.microsoft.com/Calendars.Read",
      "https://graph.microsoft.com/Calendars.Read.Shared",
      "https://graph.microsoft.com/Calendars.ReadBasic",
      "https://graph.microsoft.com/Calendars.ReadWrite",
      "https://graph.microsoft.com/Calendars.ReadWrite.Shared",
      "https://graph.microsoft.com/Mail.Read",
      "https://graph.microsoft.com/Mail.Read.Shared",
      "https://graph.microsoft.com/Mail.ReadBasic",
      "https://graph.microsoft.com/Mail.ReadBasic.Shared",
      "https://graph.microsoft.com/Mail.ReadWrite",
      "https://graph.microsoft.com/Mail.ReadWrite.Shared",
      "https://graph.microsoft.com/Mail.Send",
      "https://graph.microsoft.com/Mail.Send.Shared",
      "https://graph.microsoft.com/User.Read",
    ].join(" "),
    oauth2: {
      token_url: process.env.MICROSOFT_TOKEN_URL,
      authorization_url: process.env.MICROSOFT_AUTH_URL,
    },
    // Discord Service Action Reaction
    service: {
      name: "microsoft",
      actions: [
        {
          name: 'new_mail_received',
          description: 'A new mail is received',
          data: { }
        },
        {
          name: 'new_mail_received_from_persons',
          description: 'A new mail from a list of person',
          data: { 
            input:"The senders email you want to trigger example : [email1@example.com,email2@example.com,...]"
          },
        },
        {
          name: 'new_mail_received_from_domains',
          description: 'A new mail from a list of domains',
          data: { 
            input:"The senders domains you want to trigger example : [@example1.com,@example2.com,...]"
          },
        },
        {
          name: 'new_mail_received_include_specific_object',
          description: 'A new mail that include a specific object',
          data: { 
            input:"The text you want in the object"
          },
        },
        {
          name: 'unread_latest_email',
          description: 'Trigger when you have {input} number of unread mail',
          data: { 
            input:"The number of unread mail you want to trigger"
          },
        },
        {
          name: 'new_folder_created',
          description: 'Trigger when a new folder is created',
          data: { },
        },
        {
          name: 'new_folder_deleted',
          description: 'Trigger when a new folder is deleted',
          data: { },
        },
        {
          name: 'new_specific_folder_created',
          description: 'Trigger when you have folder created equal to your input',
          data: { 
            input:"The name of the folder name you want to trigger on create"
          },
        },
        {
          name: 'new_specific_folder_deleted',
          description: 'Trigger when you have folder deleted equal to your input',
          data: { 
            input:"The name of the folder name you want to trigger on delete"
          },
        },
      ],
      reactions: [
        {
          name: 'create_draft_email',
          description: 'The user create a draft email',
          data: {
            subject:"The subject of your draft",
            content:"The content of your draft",
            recipient:"The email of the recipient"
          }
        },
        {
          name: 'create_hidden_folder',
          description: 'The user create a hidden folder',
          data: {
            name:"The name of the hidden folder",
          }
        },
        {
          name: 'create_visible_folder',
          description: 'The user create a visible folder',
          data: {
            name:"The name of the visible folder",
          }
        },
        {
          name: 'delete_folder',
          description: 'The user delete a mail folder',
          data: {
            name:"The name of the folder you want to delete",
          }
        },
        {
          name: 'rename_folder',
          description: 'The user rename a mail folder',
          data: {
            name:"The name of the folder you want to rename",
            new_name:"The new name",
          }
        },
        {
          name: 'create_child_hidden_folder',
          description: 'The user create child a hidden folder',
          data: {
            parent:"The name of parent folder",
            name:"The name of the hidden folder",
          }
        },
        {
          name: 'create_child_visible_folder',
          description: 'The user create child a visible folder',
          data: {
            parent:"The name of parent folder",
            name:"The name of the visible folder",
          }
        },
      ],
    }
  },
});
