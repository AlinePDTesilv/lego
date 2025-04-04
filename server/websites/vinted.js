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
        const url = `https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&time=1743807545&search_text=${legoID}&catalog_ids=&size_ids=&brand_ids=89162&status_ids=6,1&color_ids=&material_ids=`;
        
        
        
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
            "Cookie": "v_udt=bURZcUQwTWRoQXBoNXZkNUU1cWVCb3RZRk9vMy0tdFVtZUtjRVlRbUpqdVlCTi0tWit2aDNMVkExT3BGOG1hdSs5dFVRZz09; anonymous-locale=fr; anon_id=ca07d8e0-4b7b-4e0c-9a14-f2041583831b; ab.optOut=This-cookie-will-expire-in-2026; v_sid=3dc660e6-1743510904; cf_clearance=FJblrIYRbjGWmmWdIOrxZjniLwlSegjwP_MTZ5QXHrg-1743807526-1.2.1.1-HA3_uwk30ucypvb4VvVaGX_XgL.tMctip8JcrJrZaQEmVfx9.GSzX1riApFGPtUDjDcAssNwZpCYuno.ifbMMAFSdRJ8n2XUfnuFNMLNH16TXyQVRpkBK6X6q7XJyjNXnbNo2Aeq9l_UhZEm1KLiWTFchG.mKqJhvxiipG.YqyeHr7WM4yTPIj4Qya7HiD.n9Jrpg4dRusY2Et1_cHNiZyNoIFmJQ1IRam48f9kHX8WapWOFDc49LxOmlxyzmgl4x3hHXfj0HYwUT_gsf5XHI0Kp_0C2sOTf4N1NePD.jB1Td9wKswIwohOjqMpQ1.BP2uf36DXJr2Bft1mXSH189xxXx.oe.QtcSOyPpg5rtDE; OptanonConsent=isGpcEnabled=0&datestamp=Sat+Apr+05+2025+00%3A58%3A55+GMT%2B0200+(heure+d%E2%80%99%C3%A9t%C3%A9+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=ca07d8e0-4b7b-4e0c-9a14-f2041583831b&interactionCount=82&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0%2CC0035%3A0&genVendors=V2%3A0%2CV1%3A0%2C&geolocation=FR%3BIDF&AwaitingReconsent=false; datadome=~GnqB~9I7xdL5feMVohmXEmO_RD56pgKCwsSM4l9dOYSQ0iUq2xfjxeOJjQdma5kiOwpE_Xz5_Kkuqp7bzcIyptKAkQusFafi2NST6OJF1SKvfFRtJY8YOhSyTfQkFhl; OptanonAlertBoxClosed=2025-01-06T14:37:15.600Z; eupubconsent-v2=CQKzpVgQKzpVgAcABBENBXFgAAAAAAAAAChQAAAAAAFBIIQACAAFwAUABUADgAHgAQQAyADUAHgARAAmABVADeAHoAPwAhIBDAESAI4ASwAmgBWgDDgGUAZYA2QB3wD2APiAfYB-gEAAIpARcBGACNAFBAKgAVcAuYBigDRAG0ANwAcQBDoCRAE7AKHAUeApEBTYC2AFyALvAXmAw0BkgDJwGXAM5gawBrIDYwG3gN1AcEA5MBy4DxwHtAQhAheEAOgAOABIAOcAg4BPwEegJFASsAm0BT4CwgF5AMQAYtAyEDIwGjANTAbQA24BugDygHyAP3AgIBAyCCIIJgQYAhWBC4cAwAARAA4ADwALgAkAB-AGgAc4A7gCAQEHAQgAn4BUAC9AHSAQgAj0BIoCVgExAJlATaApABSYCuwFqALoAYgAxYBkIDJgGjANNAamA14BtADbAG3AOPgc6Bz4DygHxAPtgfsB-4EDwIIgQYAg2BCsdBLAAXABQAFQAOAAgABdADIANQAeABEACYAFWALgAugBiADeAHoAP0AhgCJAEsAJoAUYArQBhgDKAGiANkAd4A9oB9gH6AP-AigCMAFBAKuAWIAuYBeQDFAG0ANwAcQA6gCHQEXgJEATIAnYBQ4Cj4FNAU2AqwBYoC2AFwALkAXaAu8BeYC-gGGgMeAZIAycBlUDLAMuAZyA1UBrADbwG6gOLAcmA5cB44D2gH1gQBAhaQAJgAIADQAOcAsQCPQE2gKTAXkA1MBtgDbgHPgPKAfEA_YCB4EGAINgQrIQHQAFgAUABcAFUALgAYgA3gB6AEcAO8Af4BFACUgFBAKuAXMAxQBtADqQKaApsBYoC0QFwALkAZOAzkBqoDxwIWkoEQACAAFgAUAA4ADwAIgATAAqgBcADFAIYAiQBHACjAFaANkAd4A_ACrgGKAOoAh0BF4CRAFHgLFAWwAvMBk4DLAGcgNYAbeA9oCB5IAeABcAdwBAACoAI9ASKAlYBNoCkwGLANyAeUA_cCCIEGCkDgABcAFAAVAA4ACCAGQAaAA8ACIAEwAKQAVQAxAB-gEMARIAowBWgDKAGiANkAd8A-wD9AIsARgAoIBVwC5gF5AMUAbQA3ACHQEXgJEATsAocBTYCxQFsALgAXIAu0BeYC-gGGgMkAZPAywDLgGcwNYA1kBt4DdQHBAOTAeOA9oCEIELSgCEAC4AJABHADnAHcAQAAkQBYgDXgHbAP-Aj0BIoCYgE2gKQAU-ArsBdAC8gGLAMmAamA14B5QD4oH7AfuBAwCB4EEwIMAQbAhW.YAAAAAAAAAAA; OTAdditionalConsentString=1~; domain_selected=true; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQzODA3NTIwLCJzaWQiOiIzZGM2NjBlNi0xNzQzNTEwOTA0Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDM4MTQ3MjAsInB1cnBvc2UiOiJhY2Nlc3MifQ.plj7BhVryUFMELP-jmXsBMHIDhhS4Rr0MC90CUrfpqlV8Ga6sUilXWSl-3l-CtbItBTv70WufFjhfC4n_e8-wuRBqNBVdl-l2fe1G0YWQ-uKFU3JBIT_tCBPgGM0y0PLnpaj-Nrrmeb0OH7XA_gg6A1K6C5PEfgU0TJhEVzJyIiULVbK0wD1xzdjeiw4wkGyOEIsbNoq7eurQyk7eLs1MB9pTuoz05Qmw44hNWCXQI_89cr49zUWXowilw_EdxS_nTx8M4lX9H5m2b_IZUTM0niaCOA4sdOmIwBrzwJKO9oKzUFBi5jUal_FDA6OtrxyZV6_y7hp8ndHNiEbIUkWCw; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQzODA3NTIwLCJzaWQiOiIzZGM2NjBlNi0xNzQzNTEwOTA0Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDQ0MTIzMjAsInB1cnBvc2UiOiJyZWZyZXNoIn0.BdfKDOXZHiTMCPpshm3sDQHujZHGFeA84TWyVJ2FAEqAGs0vVda5oIyD-KbfbPENOpRCu8r9mIujm-kjkzgnEZ3JQCBwFI4-IooI_jppO24gZ8E_NtGhOHL-TfUIthfT-pkYdrC3RLzCpnQLK3CXL6NGPgZ_eOkETJIo5BOHQP9KJ8DPAToHceyqfooLRFGpbxoS2ry8AdvtttdtEsmExKwCDqj7KCCvQW4q3Xw1ZTzz9Y4g2wlfg0PWhp2WLKijZYCrGfH0asVUG80jojC1sXSXn8kAC7nxp_37nKH3EQ0TwFpAEfp-G6DO4j_z1y3oiCLfZTykdkV1CSrr5zoF8A; _vinted_fr_session=aUI3MklLTkE5Zy9uRW81ZDBGUEMrY01CL0ViTm91a3ZsM1R5NlI5TUxncmRVc0luTE1JMHZyK09KSWk5ZkJiSHVTV083Zmlqb2ZEWThYUCtIMWZDYXRxL0R2Sk5SbnVDM3h0aDFSZktVQ3BxbktyQkpOa2w5ZnRIWkxvQlJ5cGdQUHJVeUw1WG1TOGpBQW1JTlQ3VFJPL0xLUGo3RDZMaWpFUXJ2OUdOaWFMT2t2TkJobmdsYUtSbTUvQTk2bFM3OEo1VXhVOGF0Ky9Wb0lCNkRMT2puOUtxbWRCRlQzRDFHN200WGxMc0ZzNjZnZlFEa1QrT3p2bFYycFY2ZkZNRkhsNDByZUJLVythTjBsVDNZTnBvUmF4TVZDMjd4OTl0dlBWU3BrRHpEMmhseG9CS0ovcmFDT2lWMWttakJ1WGFqRVJGTFVwUGN5eEhhV2J5cWxjN2dQeVRjeWg1MGpiOW1HR05VTVEyem8wL3o3bUphNDVWczltVHorUkpFVzNxL1lIWEZScFBQUDFLZG9hQnhScGRsVUFwRUJiNytVNDdvRjB1eWd1cDFHeHZwamFxbVpDVmdCRGxrUDVRSnhNQmNFdFZzRjQyVjEwd0xieG1vZ3ZoSXp3cjE4aThEV0JScGdlKzZLTFA5UzM5QU55dnJwV1ZERnRnSUhFRjhtb0MxRHE1MnZERnBJcDIrL05zMDlEZDhnRVpzRkRaWFk4ZGxpQWF4eGxLUkVteC9UM1pjVXFQTVcxUzNocVJEcEZGWSt3cit2R1lQaTJOK01iaFBJdkNmMnh4NlUzNEpZVmZWUmZ4YlpyNTBSZXdXV1pTMHV6OVlFRjRJbTYzTURoZTFXaEhlYXA2blVLYnJhZWU2azRxNVVrVzlWeHN5RlF3bEswbEVRMEZ2S012L3ZoTG04UEhVa1BmeHAzejlWd1lCTUZSemUrY0plc3pXQkxZQUJaa3dVemtIemdyd2dmYUQ0MTNSVHN4alEwOVh2cXZPdFNyUEY5VXRENlBpTFUyRTMvSmdianVsVTNxaVNjYStVVVNhM2NwYndIVXFQdlR3RWhzRW0reGVYWk9la3dYSUFXTmRZaytOQTQzaUVsVlk4ODZsRGxMOHVoWTZwWFZ4cFFEY0RYdWtjM0t1aUJZcmJIRGNJK2QxNXcyWEs4bnc4YW85ZnJLd1FFMjNISDJJWkJqRUd2SnhEejUxUGdBdUtMNGlIT09NVVpGUG0rYXVpNWNYdzI0bVQwbTEwbmxoL2pHZ2FFVllLM3kxU3BKK1ROaUc1WW1xM01LYmZnVlhUWmFXQXE0S24vTUZUZVJXL2grd2VCK1lhZlFBLzRTNStPKzB4WHQ0UUo0dWgyN1VvQkNMOG1PUkEzRzZvdEozazlvUmlxanQ1a0hnYzBrQzREVldyRG5vYS9kblFYTUJXSEJtR1lyS0UycCtsVDVWYUM2MldubzBaTGlUbGpRam1pN3ozQldsNmVqNEpKN3g2QjZwRTUyQTRSSVJ6bGlDcXh0WmNXWkJRc21pR1hwa2Vpd055Q2tmZjJMOTRqWTIxTlhqVXlBTytjOGo2TFQra25EVDd1Ny9Fb016Y0UxQXplUDlKTnBIR2NFOGZpbFcrbkpITHZic1I1d2FLOFF5K2hqaHpjYk9NaG53Y0pucll1OTkvOFg5TEd1Q0daQWpxU3NCTUVrY2RucllSMmd4U3NxVmp6NFJUSWxJaWZxOUJMbmo4eFRpM0pDK1VmZ1YxSnUweGFtN1RCR0kvc0NVK281U0laaEZsOWo5ZStrVUtTaXFtaG1BeUJ3MEJHWVFPT1Ztb0crWlZsMXNsTXplR2R3T0c3TGNBYVZkOExWUGszWVVYeldpdk5CdlRQYWd6cFpxVVFPQk11cDlHZHhUbHYxM2MvUWpYQTA1QWpZaDRKT1kzSTZueEJHb0lmaGJDWXNvem50N0J0UlNEQS9NR09wTTBtOUVmbi9RdHBqRDE5cjc0M3V0dUVCbTZYTytDZUczaDlVN21FckNpQzRNbTR0R0VSQUU4UjZ1WmVLeVlzMG9hRm43UENKWnp2cyttYWdBdWc5YjVhdzdUcExoZWJmVjBWU3BpTGFueVNpakNBRzk0N1FjbzVuK1IyUkxUQWwweFpJSlU1Q0VEbHlxSXpGVVg1WXZqN2NrMUpwdEEzemtybkNTUWtlRlZkK1lNeWdzVU1FWTVXTFlaQkI1VFNVRDZkL1p4U0VSVFBUUHRaL1VxVjM3OGRtTmtZT0x3ZXZYTTFuMGZKcU5HbjQyYlNNMzhZRWZPY3Q3TCtObndXdy9maEd0TDVWT1ZXcHZVZXJYaVJPZnNpME4vYnlJVHNXckxLK0VoSUFkYzRBRGJ6UWJOWkRLd0ZVMWF0Ri0tOG5HeXg1THhLeElqRVo4RWtvdEhIUT09--69b84aca5e327e4faad60d256c0de88a675bda50; __cf_bm=QjQnSgSsFcFsZYPMZZYUC.QCpOpVO1hiyj_vBamIib8-1743807515-1.0.1.1-LEfFh6yA3.YE1Jzior_W7oDP2_WX9eOEFSW6zBTjgtb6zIT0EE6oeJsqfYaiYfJtrDYwkjCusut0ruA48v0UardjEfdOkwZDXrMtWjZH7WHJ186UGOElUmWbccJWkxn9; banners_ui_state=PENDING; viewport_size=1536"

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
