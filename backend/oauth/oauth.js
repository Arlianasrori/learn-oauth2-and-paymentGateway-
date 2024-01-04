import {google} from "googleapis"

export const oauth2Client = new google.auth.OAuth2(
    "580245364711-jboi0vjplr3sdhju1gebf1r6gn500163.apps.googleusercontent.com",
    "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",
    "http://localhost:3000/auth/google/callback"
);

const scope = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
]

export const authUrl = oauth2Client.generateAuthUrl({
    access_type : "offline",
    scope : scope,
    include_granted_scopes : true
})