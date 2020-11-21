import {API_URL, PASSWORD, USERNAME} from "./constants";
import {LanguageDTO} from "../../src/service/response.types";
import {ArgumentTypes, Scope} from "./types";

let token = null;

const apiFetch = (input: string, init?: ArgumentTypes<typeof cy.request>[0]) => {
    return cy.request({
        url: API_URL + input,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        },
        ...init
    })
}

export const login = () => {
    return cy.request({
        url: API_URL + "public/generatetoken",
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: USERNAME,
            password: PASSWORD
        })
    }).then(res => {
        token = res.body.accessToken;
        window.localStorage.setItem('jwtToken', token);
    })
}

export const createRepository = (createRepositoryDto: { name: string, languages: Partial<LanguageDTO>[] }) => {
    return apiFetch("repositories", {body: JSON.stringify(createRepositoryDto), method: "POST"});
}

export const setTranslations = (repositoryId, key: string, translations: { [lang: string]: string }) =>
    apiFetch(`repository/${repositoryId}/keys/create`, {body: {key, translations}, method: "POST"});

export const deleteRepository = (id: number) => apiFetch(`repositories/${id}`, {method: "DELETE"})

export const createApiKey = (body: {repositoryId: number, scopes: Scope[]}) => apiFetch(`apiKeys`, {method: "POST", body}).then(r => r.body)