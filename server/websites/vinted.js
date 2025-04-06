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
        const url = `https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&time=1743873480&search_text=${legoID}&catalog_ids=&size_ids=&brand_ids=89162&status_ids=6,1&color_ids=&material_ids=`;
        
        
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
            "Cookie": "v_udt=bURZcUQwTWRoQXBoNXZkNUU1cWVCb3RZRk9vMy0tdFVtZUtjRVlRbUpqdVlCTi0tWit2aDNMVkExT3BGOG1hdSs5dFVRZz09; anonymous-locale=fr; anon_id=ca07d8e0-4b7b-4e0c-9a14-f2041583831b; ab.optOut=This-cookie-will-expire-in-2026; v_sid=3dc660e6-1743510904; cf_clearance=FJtQ4jm85wczaUV_qpBcf33oHv6CW8nezz_HAC2VKCU-1743867041-1.2.1.1-ceyer5ZLjle0NgCgNLg3ysTS9jX4AQ6k1FqbXUPaXXpUhgnf9Od5.QHdhUgdRinyVnQDcF56uCPZ4CmqDx7j6TtJi7XL.Du3MCNlotTZBpUZBiBaCTRQQgFPg.xPteANPYBYv3E2mIs5BBmjbPkOQC8wwNetCAeJklA6Np03KPZMTA8mv.8.OC5zqQfJiSKAL5Gs9e_WmG918hwPSiBXQz9yI3kujqKJhh3oQ_3F5NytOtp5YttNGgE8MIe2OwIm3PA2RtDs_F3_qhwMNHfqWv4f2jIYnMxZ7W0GzP3ih6QO7gvTZoPky1wjoR2ghHJFvg6_65wq9qJjq1gtpZdmXQutR0fgPRRIt9cgf8ZpFK88tDtSCd8vy9vnkZX5lYZs; OptanonConsent=isGpcEnabled=0&datestamp=Sat+Apr+05+2025+17%3A31%3A51+GMT%2B0200+(heure+d%E2%80%99%C3%A9t%C3%A9+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=ca07d8e0-4b7b-4e0c-9a14-f2041583831b&interactionCount=91&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0%2CC0035%3A0&genVendors=V2%3A0%2CV1%3A0%2C&geolocation=FR%3BIDF&AwaitingReconsent=false; datadome=ZL9GfKbSr3gJZQ9TRi54ozekEfxknxhvEtan6W0G_jS02xr9nIUQfeEI4Gy88glKqbSD0hmKe5beer8_8GgcCKINPLhPeawL70A2fQw7wqh4BWuMAjFPnvHjnGVbcEzC; OptanonAlertBoxClosed=2025-01-06T14:37:15.600Z; eupubconsent-v2=CQKzpVgQKzpVgAcABBENBXFgAAAAAAAAAChQAAAAAAFBIIQACAAFwAUABUADgAHgAQQAyADUAHgARAAmABVADeAHoAPwAhIBDAESAI4ASwAmgBWgDDgGUAZYA2QB3wD2APiAfYB-gEAAIpARcBGACNAFBAKgAVcAuYBigDRAG0ANwAcQBDoCRAE7AKHAUeApEBTYC2AFyALvAXmAw0BkgDJwGXAM5gawBrIDYwG3gN1AcEA5MBy4DxwHtAQhAheEAOgAOABIAOcAg4BPwEegJFASsAm0BT4CwgF5AMQAYtAyEDIwGjANTAbQA24BugDygHyAP3AgIBAyCCIIJgQYAhWBC4cAwAARAA4ADwALgAkAB-AGgAc4A7gCAQEHAQgAn4BUAC9AHSAQgAj0BIoCVgExAJlATaApABSYCuwFqALoAYgAxYBkIDJgGjANNAamA14BtADbAG3AOPgc6Bz4DygHxAPtgfsB-4EDwIIgQYAg2BCsdBLAAXABQAFQAOAAgABdADIANQAeABEACYAFWALgAugBiADeAHoAP0AhgCJAEsAJoAUYArQBhgDKAGiANkAd4A9oB9gH6AP-AigCMAFBAKuAWIAuYBeQDFAG0ANwAcQA6gCHQEXgJEATIAnYBQ4Cj4FNAU2AqwBYoC2AFwALkAXaAu8BeYC-gGGgMeAZIAycBlUDLAMuAZyA1UBrADbwG6gOLAcmA5cB44D2gH1gQBAhaQAJgAIADQAOcAsQCPQE2gKTAXkA1MBtgDbgHPgPKAfEA_YCB4EGAINgQrIQHQAFgAUABcAFUALgAYgA3gB6AEcAO8Af4BFACUgFBAKuAXMAxQBtADqQKaApsBYoC0QFwALkAZOAzkBqoDxwIWkoEQACAAFgAUAA4ADwAIgATAAqgBcADFAIYAiQBHACjAFaANkAd4A_ACrgGKAOoAh0BF4CRAFHgLFAWwAvMBk4DLAGcgNYAbeA9oCB5IAeABcAdwBAACoAI9ASKAlYBNoCkwGLANyAeUA_cCCIEGCkDgABcAFAAVAA4ACCAGQAaAA8ACIAEwAKQAVQAxAB-gEMARIAowBWgDKAGiANkAd8A-wD9AIsARgAoIBVwC5gF5AMUAbQA3ACHQEXgJEATsAocBTYCxQFsALgAXIAu0BeYC-gGGgMkAZPAywDLgGcwNYA1kBt4DdQHBAOTAeOA9oCEIELSgCEAC4AJABHADnAHcAQAAkQBYgDXgHbAP-Aj0BIoCYgE2gKQAU-ArsBdAC8gGLAMmAamA14B5QD4oH7AfuBAwCB4EEwIMAQbAhW.YAAAAAAAAAAA; OTAdditionalConsentString=1~; domain_selected=true; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQzODY3MDM1LCJzaWQiOiIzZGM2NjBlNi0xNzQzNTEwOTA0Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDM4NzQyMzUsInB1cnBvc2UiOiJhY2Nlc3MifQ.t2QbluV8fWjbehC_ti2K6k-jUN4zztZq3xEzUkTA2Q_yVo3gYvWnLfASxk3fXttd1NuLFSIZcZwf4rtNiShJn4UaLcNq1eDu-Za80pz6Qna7ZtqdlqmNhWyfb4uI_hONdslbBiuoOtv09j-P7chDjnKSYE2B8rVKmzpgj6II6BdudqT7wRlrlvtKH4uo_hWsaLzrbsceaxHA_fbBLS7NMYDqM-BZwcthtB-8PML8w9xjgcbFXtv2l10H0rNWTlQ2dJUy838PH0gFS6Xjm38NXudy4yGroOxucqXmeAjsNkRVoG4cR8eQWziaMlJapOlpKDVoVpXUcKATm1GkTB9aeg; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQzODY3MDM1LCJzaWQiOiIzZGM2NjBlNi0xNzQzNTEwOTA0Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDQ0NzE4MzUsInB1cnBvc2UiOiJyZWZyZXNoIn0.TZJNjPRRAFsG0jFp0tQcbj1kWMKFh57z1yheovdLMIZRI7kRnepLrHWMhC8I0SdiNwDhjw4GzFGOPegNSWAVpxI9bXtSO3q6jLJvPam_6YJ8uMrPMDUVqxnh-w61XyfwIayqN1OpZX4HN6x2bfdfKf1_UbuYA2mysiMhL4r8nIBAwu7C-DVRb3vLG3eGuA1mjimkDbsHbFGRFnAhNNHtPSSDGlpCs-ljRekMZe55K1CSs53yLaOD7Rjinv36JWtkDxAZo027ssZHAG1pnRwCcK8dhE_cXrWqPf4wHV04Z8hyHViEbOEiBG7kUlNuxDoN9ecO5_ZLHOO2uhNMkjFCuQ; _vinted_fr_session=eEZFTnMvQVZSeSt4SS9JOWQ3KzhuMUpOdUQ5Zmk1MmUweERqWDlyRkdwMXA0OVZzdEhzb3hBbU5UcnZyUUdadnZXZ1pFUm85djZNVlRBZVpCNTBrVWR1OENyQko3dWhIQkN5TXEyK0ZvV0ZDUUtMVXB1RDRnUnhHQU1jVXRIU05hWUJvbDFabDN1NW0wK0UrdUhpSFl0Y1dVT25wamJIV3RJbzEwRGhaTk5yakI5VVZrdUNha0xQMXU2QlBXMGxnTm85cStqeHg1TTlidE9NdnM1R05FUktiV1BUTzluSmlDMXhRQ2ppcjF0dlcvU2xEMjBGMEdCSDlvdVZmSkJjaUVBNEdzZlQvKzlnVkdHMFdrZENNajl3SXlLelpLMDRiMGZzRFArdE5RTHBqdVFwTTgrdjFlTk51eS9VRHNYQ0dDM0JFa0pjZWtYdkttcU5rWnRjQ1RKcGUzU2VaNkJIWmk0T0dxYXREUGNKcUc5U3lpZTg2WXh2RVQrQnovVVFyejQ0OEJFRytUVTR1U1RlblBub0hmWGtmc2pEZWVUVGxnVC81MlJnTUF2dTB6VUlzQnhyRzZ0Mi9CRXVQaFBLQ1dRa09OR1AvTkdTR3dhdmRKWFAwK1pNOHpPM3l5cndUc0R4Z1djaGk2VWlOZlM2RkE1UDA0T1pkenNFQUExSSt4VTZUUmxEQkU5cFNWL1BvV3JKbUpOdkxxWE1HRnlPa1R4Rm11eUV1alFManErQUdDWTVoTTVaci9HeHBneHM4WHEwcE5BOS9qWVNBSXZISlQxY2pFb0xoOVczRHo2Z0JRVi9EODZIODNsQ1dlN2NRalZJaGJHUi9EQlJzMkdNNWNkaHNSbm1Cc0hWRVhrYUZ2OUdUVGcrb1AzYTNtbUQyZHZxMmhtNGZzWXZXRzliaFp4UUREL0pKQk5mV0xFYUhUeHhlaHhzVWVjcXpqcXVuMi9qeW91KzVsazhTRkdTN0kyN08xZDJTeVBaM3hlNWk4UitHdlVPQ01PTDN4YjdxOGROemRUUEJ5R3hHQ0JGeHBJTy9ubGpHM3lsbkRQUm5KUHRkWTJNWFQ1d0pxOW54ZC9EMU91RzIvWUZyUWptWGFoYUhwTjlkNVRpNkx6bng4ZURKb28vcWhrMlB5ZXI4WmIvb1l5RzJPRW1WZ2J6SG9YQTc0Tlo4ZWxCQ3hQMXZJcFRybG1wQ3VWdkhkR1RFbWZNZVNUOFRBSFdKMW9lK2VXTTJzUmRQc2FkWWF6ZEdEUzNrbTJlTndFMEdTWjV0czdZb1h3cUxod0ppejBwM2RCejExUHVQL0FzM1Yrc1RidTYvemI0OHJnQnRlckY5OGRIM3huckw5Q0tyOTNnU0dmSlJibjd2ZVI4Z1BJUzdZTVVYMlBLaXlXUkFnZGNEblFLUVhyenZ5eC9NQXdOS2ljTW5jQ2t5TmRSOFVrWDUzSkRPZEhlWThnU1JseVhwSFVMV1JPcXEzbUozQ2l2dEw3L1dJN2JqR1RmVGFHbVdHdUhjZmtkUTVqMXMzdStDTnNpdTJuZ3BpTDgrd1VzYUt0UUVLbE5QeDhPclhBdTYxMWFSOU9UUElYUU5qeVdRZXRLMTRQa212NGsyejRkWnhDWWszdUorTkdGNGJjbGxrc2N4anF1KzdTVkowT1N4S09XOUdrSWJzM0ZVeHRhZWtLOHlXUTg5a3FzQzR6UENFZ3NiWW9YOWRZNHhNM2M1VXlXWFZjNng0QTBYblZJYkNpcWxLZEJ3eEE2ZTNVM09GUXJweTdxRmNUZDNxSyt5VFlkSHFoWWM1RXZ0YnJObWVQOE1Wa0FiaWgxblZSUFZIYnhMR1ptUm5Xd2c0TndhZ1hBVjlWRVNGV2FjaTl2dzJSektDMW12MytVdE04NVQ5Z1JTY3BFMjdGVWtpTytaVVoxNEdtaW8xbXAyUDhkSnRXdlNVRXZjN3dnZWkzQjc5RGxkVkV4RW9tRDNQS2JXblc2SEV0S2NoSmRId2YyanpnQ2JsRHQ1Ui94RGVUbmpjNUFIb25adlZJRDIyQStMTi9PWU45SmxYYklsTU95SWRwWjBaa2lHWkRzRG0wV01HeldHQ1ZTMnA4ajJDZ2d0dmloMUlYbXNVSDJCVDZ6M2l4cHJHK2tVazhEc25Ba01WSHZPZUxrL1oyK3BRbDQ0VlFTUTFjWXFSWDJoajZDMGkzeWtobnJTYkxQNCs3V09NR0t4QzhQMi9JYmZOUktxQXRqVkN2dXFtQWNqemVnQWM5d21veWJxUFRFMDRnd3psWEplMzY0T3lFcS9XZThKOXZtK2dia1hZU05jbE00Y0xpSVo4UGlTWjhwQWorWkZDMGVkbS82U3lJb0ZSVTdNNlRibE5SNjFYNGQybXdEKy0tZkgwRUZCamxXTDJaNHNRRzY2c2k3UT09--c8d71cc46084547a80c95404edd2f3edff68ed55; viewport_size=1536; __cf_bm=1M4Yge8gYVsYSoBWPZweVaWw3wy3JlKnavzr.jH5XYQ-1743873468-1.0.1.1-UaMD2QJOhIaZTjzjkWSYWSm3YxNU3klQT9646A_2_jkDy7eLz7tz8gazpll1g3MnEye2UKve3vf.P9yY9XRRYGB58QE9Oo9p1CfxA1hD0Nhd9y6lbzVpMqNFz2XTxEG1; banners_ui_state=PENDING"

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
