const fetch = require('node-fetch');
const { v5: uuidv5 } = require('uuid'); // Pour générer des UUID uniques

const parse = (data) => {
    try {
        const { items } = data;
        return items.map(item => {
            const link = item.url;
            const price = item.total_item_price;
            const photo = item.photo ? item.photo.url : 'https://play-lh.googleusercontent.com/Hs8pq7sF8ihEfencKzLZZh7w6A4jDF5CsALfnccHffE3P6rccKXULHXsdi6QrwuayDI';
            const published = item.photo && item.photo.high_resolution ? item.photo.high_resolution.timestamp : null;

            return {
                link,
                price: price.amount,
                title: item.title,
                id: item.id,
                published: published ? new Date(published * 1000).toUTCString() : "Unknown",
                uuid: uuidv5(link, uuidv5.URL), // Générer un identifiant unique pour chaque annonce
                photo
            };
        });
    } catch (error) {
        console.error("Erreur dans la fonction parse:", error);
        return [];
    }
};

async function fetchVintedData(legoID) {
    const url = `https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&time=1741458635&search_text=${legoID}&catalog_ids=&size_ids=&brand_ids=89162&status_ids=&color_ids=&material_ids=`;
    
    console.log("URL de la requête:", url);
    
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:135.0) Gecko/20100101 Firefox/135.0",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "Sec-CH-UA": "\"Google Chrome\";v=\"120\", \"Chromium\";v=\"120\"",
        "Sec-CH-UA-Mobile": "?0",
        "Sec-CH-UA-Platform": "\"Windows\"",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "Cookie": "_vinted_fr_session=OXBwVkFqZUUvNnJ5bHFGWGlNYVh2TWlNWktIRWZSRy92UW5acStHVWxPbG0zekFkWEZsSlFRakJEUVhSYXFSSjR4M2RLT0g1UCtYeW9jOFFSa2szUnhyRnF5b09YQ2l4bloxZ3hwUi9jdHZiRDVwUThEaWtCWVJoQ2VTdVB1SHV6VmRTNEdiRHFERFhCWGhPVSsvNWk3UnRlZjBLbENScmttU0RTTE45NHlQTXZWZjJETkpRcmRvTWNwZnF6TEIvNG1iV0lsMDNBL2NvL2wxWFNRQTljVUN2bk5SZk5YcmtCY3pxbVhHZmdGcTNVa0JLNjNmT3d3WVgzOTRYV2JQSC0tL1dyTTFWbEw4ME10UEJsSEVLN0FlZz09--37017cd84691505adc00475eaa59007e3fcd665a; __cf_bm=3gaPSWc8zz7c826RP0WXD.zf8CdpJBXU0alnU9zp9wY-1741458559-1.0.1.1-A3uMNnU_zYdTM46UQDpvS_b24XamFNl8_adMITZ7cBfQ8u94Ffwyydocl55TYMY3IwotAYJ3FENA7mwpBhnTBLFIt5fkeoB1kcMmLo3cNbIr_8j71aH1H0assQtyl7eL; ab.optOut=This-cookie-will-expire-in-2026; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQxNDU4NjE0LCJzaWQiOiJiMDA4YjA0NC0xNzQxNDU4NjE0Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDE0NjU4MTQsInB1cnBvc2UiOiJhY2Nlc3MifQ.kgp0C0uzgC45YmSWHWIB6RcEVEcPaUElclyb8RBiBzTGD_h-hc1qoE53imbEGJ9Sm-g0TG0_ZbgIjm8I8-SergDFIHhvI1NNpbnmXWmJxaun-cltfDgcOvFSSDIE_PQ_s6VcRYtO-Gc1prmtxpp0gYFvklZ6TgTuIH0t_oFIbSi3R764si3Fq1-Q4X1TMpS7bPANOmiyDaZMGwFPqftfCq0VDc93uMJOVfz_jQy5UCKggXhZaDTo9qGUCgwYb-UxjlwVt90jN7wNY5SYx0g22QAao7ykyaoo_aJzjOwBqjgl29KV6Nkg8YltmZCADzCjVybTioCh1EQ04exgd8z3dg; anon_id=ca07d8e0-4b7b-4e0c-9a14-f2041583831b; anonymous-locale=fr; banners_ui_state=PENDING; cf_clearance=K9.g.ZH8cbNPDGaCsbHiXLF0OV_We.IrsyqMKRBKpvI-1741458616-1.2.1.1-a3aQskCX2XjIKP1QPZSwS.a1dar3geJbJ2guiK.eVb_HpXryIMddgWzAgriaBfDH4hAJgXlJhAeVStwfxaeuCGXvqCtlIa4.5C3rJCEn6eLavNSSlbKEOo.Li3_SjFuKEd_H46Ka5y0_p0RVK0dL9srHAq.rTvpNYlGZaS8bAeUrN0YRmehR.roAUXuz4R.UT7dEgI8_L9EDX7F_eV5kvF4NtDFDy.DgCn04mPwlaBQ_AiIgXo7Vg_i_Qnkn7eXhA9W3t91DqesF6iYwaUqZAf3pjYcThThYZzdnFbC5AhbfsiKLwEbVI9EurEuvuOUHAEf5zVMyaS_5EjgviMAw8V3zzveSN4K_dQQismkCbvyi8R4XhQbcMRe3qcYb5unnNCsRonKWsyfNJ1VOfFrP26cqtAvZMsXowH5D6.bg87Q; datadome=aW6ybtE0EYzAnDb0mvy031SG4U_7bX7YZHEiERTRiGAho2hz6YP~_0ttxFYJyNFyZjxfBWj00gPEdAZ~8GtTlunYDajy5oHc33sfwHemlQhIqroKduaam2bWgqboX9LN; domain_selected=true; eupubconsent-v2=CQKzpVgQKzpVgAcABBENBXFgAAAAAAAAAChQAAAAAAFBIIQACAAFwAUABUADgAHgAQQAyADUAHgARAAmABVADeAHoAPwAhIBDAESAI4ASwAmgBWgDDgGUAZYA2QB3wD2APiAfYB-gEAAIpARcBGACNAFBAKgAVcAuYBigDRAG0ANwAcQBDoCRAE7AKHAUeApEBTYC2AFyALvAXmAw0BkgDJwGXAM5gawBrIDYwG3gN1AcEA5MBy4DxwHtAQhAheEAOgAOABIAOcAg4BPwEegJFASsAm0BT4CwgF5AMQAYtAyEDIwGjANTAbQA24BugDygHyAP3AgIBAyCCIIJgQYAhWBC4cAwAARAA4ADwALgAkAB-AGgAc4A7gCAQEHAQgAn4BUAC9AHSAQgAj0BIoCVgExAJlATaApABSYCuwFqALoAYgAxYBkIDJgGjANNAamA14BtADbAG3AOPgc6Bz4DygHxAPtgfsB-4EDwIIgQYAg2BCsdBLAAXABQAFQAOA…gAYgA3gB6AEcAO8Af4BFACUgFBAKuAXMAxQBtADqQKaApsBYoC0QFwALkAZOAzkBqoDxwIWkoEQACAAFgAUAA4ADwAIgATAAqgBcADFAIYAiQBHACjAFaANkAd4A_ACrgGKAOoAh0BF4CRAFHgLFAWwAvMBk4DLAGcgNYAbeA9oCB5IAeABcAdwBAACoAI9ASKAlYBNoCkwGLANyAeUA_cCCIEGCkDgABcAFAAVAA4ACCAGQAaAA8ACIAEwAKQAVQAxAB-gEMARIAowBWgDKAGiANkAd8A-wD9AIsARgAoIBVwC5gF5AMUAbQA3ACHQEXgJEATsAocBTYCxQFsALgAXIAu0BeYC-gGGgMkAZPAywDLgGcwNYA1kBt4DdQHBAOTAeOA9oCEIELSgCEAC4AJABHADnAHcAQAAkQBYgDXgHbAP-Aj0BIoCYgE2gKQAU-ArsBdAC8gGLAMmAamA14B5QD4oH7AfuBAwCB4EEwIMAQbAhW.YAAAAAAAAAAA; OptanonAlertBoxClosed=2025-01-06T14:37:15.600Z; OptanonConsent=isGpcEnabled=0&datestamp=Sat+Mar+08+2025+19:30:30+GMT+0100+(heure+normale+dâ\u0080\u0099Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=ca07d8e0-4b7b-4e0c-9a14-f2041583831b&interactionCount=75&hosts=&landingPath=NotLandingPage&groups=C0001:1,C0002:0,C0003:0,C0004:0,C0005:0,V2STACK42:0,C0015:0,C0035:0&genVendors=V2:0,V1:0,&geolocation=FR;IDF&AwaitingReconsent=false; OTAdditionalConsentString=1~; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQxNDU4NjE0LCJzaWQiOiJiMDA4YjA0NC0xNzQxNDU4NjE0Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDIwNjM0MTQsInB1cnBvc2UiOiJyZWZyZXNoIn0.RbVK0WAhI9aiQl-0O6XayPZB39_Mc97_SziKtIjDso2IF6cxdS1Zo-pWtxq8jYJ7Ovd-ERkKkaFco613T9WxY126taVx0QBaIef90C0VPPOyyFI62qQu0MmrWXZqWxC5Wyxge9XYRKa1_fp0kFe9VSo_O1qRJa8jm4eym2Ovpgq_8b5jHIg-_pWpoEtObAEWr03Kb7N7A48IHSzJjL2rK_NwbYc5FM-MD5YiFUmMM6NvpNW4BEvcni-jMMSnRniaVycydvgMJ2mf-gHTeHF3W_2xbjuKSi2FE5ogDMP94V05J70J7xgxlJgLTmR4g6ImnqrXt66467l-2gPP5bVlKw; v_sid=9f5c6fb17723d1f8280f8e8d800af31f; v_udt=bURZcUQwTWRoQXBoNXZkNUU1cWVCb3RZRk9vMy0tdFVtZUtjRVlRbUpqdVlCTi0tWit2aDNMVkExT3BGOG1hdSs5dFVRZz09; viewport_size=1536"
    };

    console.log("En-têtes de la requête:", headers);
    
    try {
        const response = await fetch(url, {
            headers,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET"
        });

        console.log("Réponse de l'API reçue:", response.status);

        if (!response.ok) {
            throw new Error(`Erreur ${response.status}: Impossible de récupérer les données`);
        }

        const data = await response.json();
        console.log("Données récupérées:", data); // Ajout de logs pour vérifier la réponse
        return parse(data); // On applique le parsing ici

    } catch (error) {
        console.error(`Erreur lors de la récupération des données pour ${legoID}:`, error);
        return [];
    }
}

module.exports = fetchVintedData;