const fetch = require('node-fetch');
const { v5: uuidv5 } = require('uuid'); // Pour générer des UUID uniques

const parse = (data, legoId) => {
    try {
        const { items } = data;
        return items.map(item => {
            const link = item.url;
            const price = item.total_item_price;
            const published = item.photo && item.photo.high_resolution ? item.photo.high_resolution.timestamp : null;

            return {
                link,
                price: price.amount,
                title: item.title,
                id: item.id,
                published: published ? new Date(published * 1000).toUTCString() : "Unknown",
                uuid: uuidv5(link, uuidv5.URL), // Générer un identifiant unique pour chaque annonce
                legoId // Ajout de legoId aux données
            };
        });
    } catch (error) {
        console.error("Erreur dans la fonction parse:", error);
        return [];
    }
};

    
    async function fetchVintedData(legoID) {
        const url = `https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&time=1743954876&search_text=${legoID}&catalog_ids=&size_ids=&brand_ids=89162&status_ids=6,1&color_ids=&material_ids=`;
        
        
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
            "Cookie": "v_udt=bURZcUQwTWRoQXBoNXZkNUU1cWVCb3RZRk9vMy0tdFVtZUtjRVlRbUpqdVlCTi0tWit2aDNMVkExT3BGOG1hdSs5dFVRZz09; anonymous-locale=fr; anon_id=ca07d8e0-4b7b-4e0c-9a14-f2041583831b; ab.optOut=This-cookie-will-expire-in-2026; v_sid=3dc660e6-1743510904; cf_clearance=CjpArS7jiM.uHQdTix0OCJqLFEslPvC0X1u.t3YSDw0-1743954846-1.2.1.1-OgVyKEmodtF3RRTMur6hrqSMfupTcnx9PgTJmDtT6GIG4g3ZbegMD4CHLz7p7fqmpe_ovJM6JcsfL8QuGV4yE_K8Wu9oPvC7Gy_mta24yApXFn_DC7jP2kPrIkmePW54HHfF.vd6UyR.YhZB2YdDxkzHiCsfQ8ky4xA8.vh2_3v6Fg1Xkw2HdTTp4QjZcOBUOgEXhyRgCQQRgd0OBKQZVqoY4HJv3QyV4fXSMde3nqxB_m92U3SgZnXsT9Ef0MTXD93dIDEYTs1WyreYmeI_l6N0Vnku1lABX1dRcFUSXWPTV.KURJIc9LTo3D4VqRD4wnQ9tfaiNbX.bw8J7jKjNB6TTn0jaJLgdyC3wOIawYeEPNv17SaKLRR.MjTbrTKP; OptanonConsent=isGpcEnabled=0&datestamp=Sun+Apr+06+2025+17%3A54%3A24+GMT%2B0200+(heure+d%E2%80%99%C3%A9t%C3%A9+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=ca07d8e0-4b7b-4e0c-9a14-f2041583831b&interactionCount=108&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0%2CC0035%3A0&genVendors=V2%3A0%2CV1%3A0%2C&geolocation=FR%3BIDF&AwaitingReconsent=false; datadome=fS5y6wtPupAXXAnp2mDva_cJS6vUyX_KW8CbcNSrYC8PZqHzAqhAgeIFNl8aXnCt6GxiuU8xiDKS3pAKWxMZTncdcN6H_iswqC_F248E2~isYe20WADcpKm4IDnmTnkd; OptanonAlertBoxClosed=2025-01-06T14:37:15.600Z; eupubconsent-v2=CQKzpVgQKzpVgAcABBENBXFgAAAAAAAAAChQAAAAAAFBIIQACAAFwAUABUADgAHgAQQAyADUAHgARAAmABVADeAHoAPwAhIBDAESAI4ASwAmgBWgDDgGUAZYA2QB3wD2APiAfYB-gEAAIpARcBGACNAFBAKgAVcAuYBigDRAG0ANwAcQBDoCRAE7AKHAUeApEBTYC2AFyALvAXmAw0BkgDJwGXAM5gawBrIDYwG3gN1AcEA5MBy4DxwHtAQhAheEAOgAOABIAOcAg4BPwEegJFASsAm0BT4CwgF5AMQAYtAyEDIwGjANTAbQA24BugDygHyAP3AgIBAyCCIIJgQYAhWBC4cAwAARAA4ADwALgAkAB-AGgAc4A7gCAQEHAQgAn4BUAC9AHSAQgAj0BIoCVgExAJlATaApABSYCuwFqALoAYgAxYBkIDJgGjANNAamA14BtADbAG3AOPgc6Bz4DygHxAPtgfsB-4EDwIIgQYAg2BCsdBLAAXABQAFQAOAAgABdADIANQAeABEACYAFWALgAugBiADeAHoAP0AhgCJAEsAJoAUYArQBhgDKAGiANkAd4A9oB9gH6AP-AigCMAFBAKuAWIAuYBeQDFAG0ANwAcQA6gCHQEXgJEATIAnYBQ4Cj4FNAU2AqwBYoC2AFwALkAXaAu8BeYC-gGGgMeAZIAycBlUDLAMuAZyA1UBrADbwG6gOLAcmA5cB44D2gH1gQBAhaQAJgAIADQAOcAsQCPQE2gKTAXkA1MBtgDbgHPgPKAfEA_YCB4EGAINgQrIQHQAFgAUABcAFUALgAYgA3gB6AEcAO8Af4BFACUgFBAKuAXMAxQBtADqQKaApsBYoC0QFwALkAZOAzkBqoDxwIWkoEQACAAFgAUAA4ADwAIgATAAqgBcADFAIYAiQBHACjAFaANkAd4A_ACrgGKAOoAh0BF4CRAFHgLFAWwAvMBk4DLAGcgNYAbeA9oCB5IAeABcAdwBAACoAI9ASKAlYBNoCkwGLANyAeUA_cCCIEGCkDgABcAFAAVAA4ACCAGQAaAA8ACIAEwAKQAVQAxAB-gEMARIAowBWgDKAGiANkAd8A-wD9AIsARgAoIBVwC5gF5AMUAbQA3ACHQEXgJEATsAocBTYCxQFsALgAXIAu0BeYC-gGGgMkAZPAywDLgGcwNYA1kBt4DdQHBAOTAeOA9oCEIELSgCEAC4AJABHADnAHcAQAAkQBYgDXgHbAP-Aj0BIoCYgE2gKQAU-ArsBdAC8gGLAMmAamA14B5QD4oH7AfuBAwCB4EEwIMAQbAhW.YAAAAAAAAAAA; OTAdditionalConsentString=1~; domain_selected=true; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQzOTUxMTc2LCJzaWQiOiIzZGM2NjBlNi0xNzQzNTEwOTA0Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDM5NTgzNzYsInB1cnBvc2UiOiJhY2Nlc3MifQ.MZVyHy1YNbayWYqEhSK8iYUIydmE7zYrgt4CYFHSWZxhT-SEuN7z866jtUDTa_fzfb7SrIN1M83fG_UgyqTMI-8eIVce8GGLalAum7aDJ4LDu6-AtOS7-QdZ3NHvh-SITCaI3hfKFXZFCQ8mbuPoER2D9zZxhtEgm767J5o6kJNcbdsFr3M8wGwrcZq9CgWXdXJXdhtbTsWv04b1fNGqNAjRESUxm5nrgJ4RyW-_N6f7mopzstvB-EcmDXSEdngD4z0ct_AJiL1kXyggFNjsoLscuIO-UszDtbNcUA6UQ-1MVU-pEnyTYyE5yZYj5a085J4x8rDyOFCdivQEKv1OZQ; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQzOTUxMTc2LCJzaWQiOiIzZGM2NjBlNi0xNzQzNTEwOTA0Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDQ1NTU5NzYsInB1cnBvc2UiOiJyZWZyZXNoIn0.Nl9DjNVRZjR3Z_GsENOWFn7a1rCRYtN_zcAFA5bxiF0AUkmc2r5eyCAUoZD6PD879hm00tIO4BL7Hd-AgvKW5Hv1CYmn6GoW_tIt458F32bE4lEMaIEQH7hDPxbLNhM8uZrflPVVfNilWPJBS5EcWSh_qb3JbTDttnwKKjqmT-i54lP4ovCww8UAFFNtUD8eij-ShQkyvxqSGJMsweCb9hbJUPEEg2lcQHCuVUCku2b8UfFdvvzfrEhWK_2FJ_stUKpvf6fl7cRzQ34V13HR03ufrmKS9So8w_G4QultC2CgSSG3DrO-03MSp7yFOcF3aiJgq07HymU5u7sGSiMThQ; _vinted_fr_session=bVJqMUUrem5pb2REOUhsVmJlY3UzSUdvN3FEcHpVa2NKNDMxSGkwZnBocyszK29qaHR6VmpNeHIwbGdHSFltaktpQ25Cb3dYVGFVNnp4RlAxNnZLNDFad3hLa0hYc2ozUENUQXRudk4xS3J1eXlXdWljVHZPUE5zVlZJWFdXUmpNQ2lDRjZPZFRycVJJcjVWZzFnNFZLMzhQM1cwc3F0RmxUVks3SVgzWWFtbjJ5VmNrUDJTc01RMVdmZnVUcDVNY2ZnV3lDRzh5UzNuWGoyM0lKWjNMVkZYT3FnaGMxb05IWS9NNElVOVlLSjBSVnJ1ZjVqcm1UWG9rVnNVM2I1L0hmUFh4VWJ1ODVsZnFGbEp5ZUNxNXBFbENGS01WcXRqVkxWYjlpck85TEVlem43VHRHTFVmbmsxKzFHNlVMd2FmdGZCczNhR2xOTVBiRTZCNmVZWFh3dlFzOCthbnhDMWtQSFVxYUU5OEhWN3kzclpnWFc0dDdReEtRU1R0djlDaEI1bXZ3cGFzbTNRWWR6Y1BoRDVYVzdveDBRaEZLbEcyZnlDYVk2M2oveXpYU1Q3Um5sT2d3bTFucVBvR0c4Rks1c1VkVzEwNmVjMG1OS0wxTTlvUjd6S283VWpBYnIvMFpCcCsvQ3IxTEVBcS80aElzTU4wN0pmVTFlWDRVblA3Y2JIWHhqMlRldFJTMFpMWWtMQi9YTTEwRzBXVTZwS0pBc2VDa291b0NoaC94TkUrd2w0Z2tidlU3bHVsTjJNTWhzcGpwV0lnMElaYysxRUwzaWdpUSs4RzFLY2tZNzkwZkgwb3VwQngxWjcvUUx1VVhFS1hDanJLa3NYanNrbTFHNFhtTEVoRFNKK01sV0ZTZ1lWSG5RbEVWdEJpL0JTdVpOTHZiME9TcDJBcldUL2RMTmdXV29RdGhwMThjUHNmRDdZMTRwemkwbmdWRVpzOXJNNllKenM0U1JpUm5pTk9qSzVyb3ZiV0U0ZFhVQnBpMUFvV2MxdW5mbTF3TVZTVUdwUFBiNUJmN2lLWGhOVzVKWW9vK0pUdkpHeEFFNGY3ck5IQUtFMklXZ29TaVErVG5UcFRsdDZNUEF3eDFLT0hLQnRWYmQ3cFd0WHhZQWxLOWI0STlFcGNwR3MvTG1rVHZFOERrTWdTNzdtWWN3UUhjRTYvU1M5UWtRQ0d6M0NhUitaKytNSS93bVFab3NoaitvazVMcTBjNUtDeEhFUEt4TmZLZXIzVTcxWnRmWXZndGx1TUV2cHVkM1EwQS83ZTVEVVRQRHI1Q01BZVFnNGozSW55TXhTNE1zUmVOZjBJOTJDUU0xSE9adzU1dlNYVS8xSThzWFAxcWNGeTRjekQ0M2xlTjNzOTQrdXVMR0hmT251T1NyVEI1T1NvRG1WRjlpWFJOd1ZheUdoYnhwNVB5Y3V1RzV5SytpWlp3ZzZsOE0zeDB3TWxybVZ5Q0ZuTDh6eWg2U2phQVM3ZFEzMGc1UHJ0blNhb21zSGFwQ2x2eU1FQjl0RXoyeUF5Rm9jVERGZEgvRVVJQlVQOWlVSjk3YXZJVmZ5MmF3dm05NWNDN2RyZWpvVHV2dEEyZXpwSzIvNmx6ODFnRFhnOE9UZmRqeVkvdk9lbzZ1cjYrdmFqNHMzNDZIZVc3NGRMcGV4bGVHUDUrSVc0Ukd1UEhFbVVxazhhWmJpUzRIdGRxTE9QVEVxSGdRd29oVTVlYU00L2VCN1lWbkRrbmo1TGllK0xJK2JXNEQyOWpocllHTG1vM0tqajJ0L0Y5eEpiUXVLbzltV0RleE5QWnJlSEltZU0wc0NPYmtNQ0JMWWlaRHljM1phU3ZRbTVYaGUvRlRsWDU0UHh0N2dGMXZZRFhmdEtjSkdEbXVPaGtwUWxmQ1JxNTdITXBpTHhOMmxGVkFPSFFtNE1IYmtrY0N1SDdPMTU0RitxODFTcVJ2dEs2NEFQbmM4LzhvSWlUa21iWStrYUtYVlBWd290a3RUNTJsVk1Cd3luSHcwS2dGZHdkZzhGMElOUC9GcVJmY0dWenQ2MWlGQ1VrWGo1a21HTnZmQ0NBcnk2M3NXWXhlMkE3MXVBYnhyV09yVjhmRXh1M21BdnhKOWt4bVRIZmhtVlQ1QTVja25pMnBSc1Q2YXRTS3M2QXhCUTZRRjQwZ3RTVFkyOFk2YXdNZGZYTUtvKzd4dVF4MWg2N2NRdE9INFFZQ2t5UmFja0hsODlNZ2ZSNGJ2dkxKcUZhNldOa1JJeUo5eVd1emRWUXhkM0xpeDMyeURScXdDdlUwS0lqU2lZbEtnb0RmVk9idkl4SGRaOWN3U1ZqLzM4cjVwNWFId3Bya1ZVWFNxdVA3c2gvM1IvcUV3QnQ5UWlmNEk4SXFUVEMyRC0tcWVqeXdVU3NsOGp6b0h4VVFHeHM3UT09--4d1aa06ff7f21a3596da5064d57108652800069e; viewport_size=1536; __cf_bm=aCETA0zQvylslCy846mtqzUf44sbxwZ4_LvU1Obrdlc-1743953580-1.0.1.1-.ZBxak3FKyoeYS0GVhXEZ08kvkYNTlxqwXQ_ZEPO.EPuvbZvPZoHscGf67LZnAghvsVf3fihWJq_ntIHw_tz9EJ5V0x2KH7dzyodxhNsB8.3tO5vGmYk9C5zwmgxy015; banners_ui_state=PENDING"

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
        return parse(data, legoID); // On applique le parsing ici

    } catch (error) {
        console.error(`Erreur lors de la récupération des données pour ${legoID}:`, error);
        return [];
    }
}

module.exports = fetchVintedData;
