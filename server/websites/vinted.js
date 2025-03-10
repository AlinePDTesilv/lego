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
        const url = `https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&time=1741610413&search_text=${legoID}&catalog_ids=&size_ids=&brand_ids=89162&status_ids=&color_ids=&material_ids=`;
        
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
            "Cookie": "v_udt=bURZcUQwTWRoQXBoNXZkNUU1cWVCb3RZRk9vMy0tdFVtZUtjRVlRbUpqdVlCTi0tWit2aDNMVkExT3BGOG1hdSs5dFVRZz09; anonymous-locale=fr; anon_id=ca07d8e0-4b7b-4e0c-9a14-f2041583831b; ab.optOut=This-cookie-will-expire-in-2026; v_sid=b008b044-1741458614; cf_clearance=oBAjQjT_gucVj0zJKD4lIsxIiHsRxnasN2S04oqr8UU-1741610376-1.2.1.1-4.1k6X3EKHTyE0mx5EJ7vZ3E.ecUCJlt_Ws3TI4.8WsMvHzfOg5pOUOOTTivTF8hGNT5DEegcdk_O8tQypPs.bdtXMkmd5ahWktE9PigePz8Nmo2vUZ6zIozsVR6MmzQQE37jRHb5zrXjIGXCIw4u6PTQVFfZ4SfD8HOocZPkFTB7pEEnTFLhDHxqUMyie9Wh4rzV2XECUZQqrqi0XmSXrbEYdJN.jt0nVbdhFpaF9znIuS6kL4A7h5AgaiEPBWvAiYDcOv4Gl1kN.SUmrjxShujfJHolsrAEQui_hrMWM2AwIu9qvRfSntYB0SyVTH4jleC.8JhcUbWZt3Es9WKNxcMj8vfs2bfRkJOSIeNBuZ3.oVTJOVnD6.sJVdJ.Ouy4OyM0JdUPbjZp9uNdJA1n.hcnuLJN3HTc5tQK96wNaU; OptanonConsent=isGpcEnabled=0&datestamp=Mon+Mar+10+2025+13%3A40%3A09+GMT%2B0100+(heure+normale+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=ca07d8e0-4b7b-4e0c-9a14-f2041583831b&interactionCount=78&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0%2CC0035%3A0&genVendors=V2%3A0%2CV1%3A0%2C&geolocation=FR%3BIDF&AwaitingReconsent=false; datadome=oezufTy3kIa~HTxy2R~R2W7u~5qKjLrxAB0Gi7HIoSNWRRmk5CHhV3aoBeL3YLN4EdN~nEVko00SNG86AnrIqTHS_vCM7l5nCrW5Gu34Mbo2t4xXNiqR~4S2rCnuxaFG; OptanonAlertBoxClosed=2025-01-06T14:37:15.600Z; eupubconsent-v2=CQKzpVgQKzpVgAcABBENBXFgAAAAAAAAAChQAAAAAAFBIIQACAAFwAUABUADgAHgAQQAyADUAHgARAAmABVADeAHoAPwAhIBDAESAI4ASwAmgBWgDDgGUAZYA2QB3wD2APiAfYB-gEAAIpARcBGACNAFBAKgAVcAuYBigDRAG0ANwAcQBDoCRAE7AKHAUeApEBTYC2AFyALvAXmAw0BkgDJwGXAM5gawBrIDYwG3gN1AcEA5MBy4DxwHtAQhAheEAOgAOABIAOcAg4BPwEegJFASsAm0BT4CwgF5AMQAYtAyEDIwGjANTAbQA24BugDygHyAP3AgIBAyCCIIJgQYAhWBC4cAwAARAA4ADwALgAkAB-AGgAc4A7gCAQEHAQgAn4BUAC9AHSAQgAj0BIoCVgExAJlATaApABSYCuwFqALoAYgAxYBkIDJgGjANNAamA14BtADbAG3AOPgc6Bz4DygHxAPtgfsB-4EDwIIgQYAg2BCsdBLAAXABQAFQAOAAgABdADIANQAeABEACYAFWALgAugBiADeAHoAP0AhgCJAEsAJoAUYArQBhgDKAGiANkAd4A9oB9gH6AP-AigCMAFBAKuAWIAuYBeQDFAG0ANwAcQA6gCHQEXgJEATIAnYBQ4Cj4FNAU2AqwBYoC2AFwALkAXaAu8BeYC-gGGgMeAZIAycBlUDLAMuAZyA1UBrADbwG6gOLAcmA5cB44D2gH1gQBAhaQAJgAIADQAOcAsQCPQE2gKTAXkA1MBtgDbgHPgPKAfEA_YCB4EGAINgQrIQHQAFgAUABcAFUALgAYgA3gB6AEcAO8Af4BFACUgFBAKuAXMAxQBtADqQKaApsBYoC0QFwALkAZOAzkBqoDxwIWkoEQACAAFgAUAA4ADwAIgATAAqgBcADFAIYAiQBHACjAFaANkAd4A_ACrgGKAOoAh0BF4CRAFHgLFAWwAvMBk4DLAGcgNYAbeA9oCB5IAeABcAdwBAACoAI9ASKAlYBNoCkwGLANyAeUA_cCCIEGCkDgABcAFAAVAA4ACCAGQAaAA8ACIAEwAKQAVQAxAB-gEMARIAowBWgDKAGiANkAd8A-wD9AIsARgAoIBVwC5gF5AMUAbQA3ACHQEXgJEATIAnYBQ4Cj4FNAU2AqwBYoC2AFwALkAXaAu8BeYC-gGGgMeAZIAycBlUDLAMuAZyA1UBrADbwG6gOLAcmA5cB44D2gH1gQBAhaQAJgAIADQAOcAsQCPQE2gKTAXkA1MBtgDbgHPgPKAfEA_YCB4EGAINgQrIQHQAFgAUABcAFUALgAYgA3gB6AEcAO8Af4BFACUgFBAKuAXMAxQBtADqQKaApsBYoC0QFwALkAZOAzkBqoDxwIWkoEQACAAFgAUAA4ADwAIgATAAqgBcADFAIYAiQBHACjAFaANkAd4A_ACrgGKAOoAh0BF4CRAFHgLFAWwAvMBk4DLAGcgNYAbeA9oCB5IAeABcAdwBAACoAI9ASKAlYBNoCkwGLANyAeUA_cCCIEGCkDgABcAFAAVAA4ACCAGQAaAA8ACIAEwAKQAVQAxAB-gEMARIAowBWgDKAGiANkAd8A-wD9AIsARgAoIBVwC5gF5AMUAbQA3ACHQEXgJEATsAocBTYCxQFsALgAXIAu0BeYC-gGGgMkAZPAywDLgGcwNYA1kBt4DdQHBAOTAeOA9oCEIELSgCEAC4AJABHADnAHcAQAAkQBYgDXgHbAP-Aj0BIoCYgE2gKQAU-ArsBdAC8gGLAMmAamA14B5QD4oH7AfuBAwCB4EEwIMAQbAhW.YAAAAAAAAAAA; OTAdditionalConsentString=1~; domain_selected=true; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQxNjEwMzc2LCJzaWQiOiJiMDA4YjA0NC0xNzQxNDU4NjE0Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDE2MTc1NzYsInB1cnBvc2UiOiJhY2Nlc3MifQ.LTLOZ_GlQHqQDRZc9H44MJFLaXY6406YFzGehhZfrd5l5k8Q470kIPmUyiJb3OQ65whvsh5qfiXJjFtNBGkDaUdy7Qa8VoEsndCIMfvWo4lZxJsLB9dgUGL_xEwh_RS-gaLc3J1kM_ikPP3TMQvfS4KVfk0hzmrVdpmZVZxFG7x-CJINeux89dz3qx9VZGVQwyK6GAvpS4eXJH6ci4R9eq8oUOxtefRQI_FiLyp_NdKduA9_iLX4gLV1a6zYV3-jzptpWa60VgnshEcY6MnxZzYUGcsbpZ0buA7gzWdLCkTnW-1iIihYgWLYa8sppsyoXzDAgq-9vv52CmNEQtQTqQ; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQxNjEwMzc2LCJzaWQiOiJiMDA4YjA0NC0xNzQxNDU4NjE0Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDIyMTUxNzYsInB1cnBvc2UiOiJyZWZyZXNoIn0.p2M5V0jPIBPnMvz3qz9Lhn5PuPoBkilByKcx_-is0yo9-rRZh3fHMZSGW7y46H1UoNgalJ1bc2gW1LC7J1ouhHCE3tDiroPthgRyrDBvloz8-hQwYSjTMQTaTZu9i7IXOXS9MHrnkgJKFUJ9gHVuuWtYZYVHkuOHso79PlAb3SmfbZvta9HpV9m_zczzPBtMMEuHBBw7QJkjiCIAm5RtDNYeGBIeKEOLda6ZHcNr56N7oWBPnvyBp7d2SizWDElbQ3tVFPT1BQzUWg3jN9UYLgJtlAUFaWWKOJt1n7QyVL_dsA9PoNC-T5dDLo4xpFp3nIKugYetMUA4wu-XdhMBeg; v_sid=b008b044-1741458614; _vinted_fr_session=Q3dLMUpramNWbGJSbHBpVStyTnFJR1FZaWdBT2lJOStPc1J4TnR5R2RlKzRWRVM0K3ozNnkybjkwa2ZqOE5SdjRhaUFocFB1d1FxL2l1dVFDTi8xL0tOeTVWTFYrTkU5a1Nmanp5a2hSdWVwV2Z1K1A3WnlZQVk4VzRPa3V0SHJkd3hka3ZzaW5wekNSTzMyek1tRmtvOUVSYUVrRkp6dHVIYnd5TTd3MkhRbW5QUDJMVTU3eVZOZ0JLb2NwT3BvMlJZT3VtN2tvNDVaNU00UjBycmx0Y2pScmd0UFR5dkdLMk93MnA5b0lMcXU3WCtVTE9VZGdHNEZJVDg1L1EyRmJxdlpMVzhOb1dPTlY4a3VJUEdLN1pCQmpyendYa1loTk95bEtWcjdya0hoREZuaThDekEzZFlJQmk2Tm1wc3JNUGZKTEo1M2ZSdHo2NkNqZTVQVmxIQUUzNmtiMkN5YWM1TUIvQ1hCSHhINUJRVVhLR0plNnE0NXBiRWdFR3RSTXBnY0RmUVRXQWdYTklnUERGKzFUTk5Pb1dxT2YwQkFiTE4zc1FMNE9UQytRSlYwTDFFT3FlOEREblZ1bEF3Q2FFR3h"

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
