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
    const url = `https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&time=1740412475&search_text=${legoID}&catalog_ids=&size_ids=&brand_ids=89162&status_ids=&color_ids=&material_ids=`;
    
    try {
        const response = await fetch(url, {
            "headers": {
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
                "Cookie":"_vinted_fr_session=bXIyTkpKVys2aGZndkpEZGNSK3RBZ3lLKzVwT1g2QUlMbEFPREtYYVVKeHkzSDVYNjI1ekVOZXlWQ3JQR0VqMHZpLzF2bENaT1U3QzladWIzMmU1Y1BHcmcwdTB0MTFYN3RBSFllcEdUbnlLbG9leXVQSVJhV2p3dEdnak56N1R1RHhPMC8xejYvT256b25KR09TYUpqVVovU0h1RlBOclFzb3dwMXd2bms0QWZPb2pNU0kzUlA3cTJGVVBQNHNtZEZxYjZGNzR5Nmh2VGkvOUVLWGFrSmtqLzYwSlJRQldLcE5sL0VWaGdxUDRqQnRHcnR4WEdITXhmbzVuZXVnNGEwUXdRZWJIaElpRlhFRmZCS25DUmRiZHBpRFFjSE1ZaFBvV0JnTUY0OWRkQUsxTU9SdGdFY0FUQTJsalFrNEtKczhWQnhWVlVkYmVhejQzZGxmdWZyVXhCVFZRQ3l0cEVpMzVBMWRWWTV0R3BWdFN5M1dNdzNqY1VtTFJzbzV6RUg1b2gwL0Z1Sjl2SGFYL01lWFdDengxNWd5VE1xNGpGblFMS0tiUVZnZEUvZE5LdWUraFlEOUhsZW50akQ2TkNMSHRHekFpKzQvcFpFWS9wQU9Qa0lmUmVPSFN1bVU1Rlc1aVdlVmEyVERmWXFRUkxOUVR4MFc5RDVsaEZ0QzZvRGZCcmx1T2ovSVJ0UVR1ZnBlQzdPTTc5a3BIc1RNbllQbkJWSEhURGdTVDZSK0RLZzlOUnY5MkRHZ2x1bzg0bVo2bkRYT25KaFdGenVCNXNpRnRNRmRmRjJHR1g5TkY0YUd2a1FMY202NkdyMDFob2x3bVBxcUE2M0dCb0NSd2FpeHBkd1FmQkthZEJWS0VFZ2p3MmdrQjFtZXFYWXhaODRhVmo0dzlLQ2s0ZmhNUURIak42SWlMd2VYcHVjc25WS0hjY0YxMWJGZVIyUjhJMnpCT25QVUhzeWVOVnlVWDRnSmdTVTNzNjl6S2h4VlBHL09nVDNETVdoOXNQTGZiS3k1VHo2M0dNWXJRM3QzeHZHbUFaVEFGbXYxbVZaeHJvWkl6UHNnV05GY296YkJES05lU01MZmJ2M09jUVgzYWtrcEkxSURyc1VKNnNQSWlMdFR5dlFuRy9iSWtZMVA4T3d0UjA4Q01HU2hCTFRqRTQ1ZnpnOXNnaHh1Tnd0b3AxeFd5djFCS3BHbUVkWDBmUU9nOUNyc0xWV01jNTdPM1NGQ29FUjh1K1ZIc082dXUvN256Z2p3MnRFME5nMmlBWDN2QjVueHNKSXpWUXJkQ0JmNnB3cDM2OHpsOHVQZDBZdG9yZENlZlJuVzFuMUZpL1hTblc4UGZjMnhKQVhQYjhIdzBkTG1rZUUwbXA1L2lPazZaaGlYUEVnODI5ZFh1LzkzWnJrVDVCaGhFb2JoQS9qSkJScTZSZ0JXVFU2aDYxRVFQZ2hsNmNRYnZVdkhKdEhyd1JNSW42V3JSdDFMKzg5NXZMcjFac1U2L0FMVERGcXFINWdPUmh5WlFXYmpUOTRnYnBxTGl3SFY4M2lMdnZ4YjV2QlZPSXppOWhRZXJCMmhZM2VwMjlxOWovR1NRMHA0MkZBcFdFd0t4YWwvQ1FITHhOdzdJb3JHN1FkY09tQU0vSDc2R2RZMlYxem1ad0hXRnlNR1U2dzVLeDl3ZGlYd3dJZlU5RGhSTlYwc3ZoZVRhZ3NvbDNvbk9QRTc5bDdmU0x2c1RSQ0M2RUx5aVM4azdUR3hBWklGYXBPcHd2d1hLQW13MEo4SEZpYTB6SmlDZDhRUnN4YzhNMnBRV0JNUGZvNk5YL0VNdTBZYWsyQkJtV3pyNkJwUHpaN3FkY1h5aXRaT0xWWmZkU2hMQzBUdXFucVdMc2dWb2dKS21zRjFFUjNYTFo1aEVKUTBEUE9wajJMSldORWRHenNzKzN2bHl4emdDYnY0WmQwZGVHSmRrdkdYdXRRVi9oc2NXWnpiQzVpWWdEYitNZ0t6RmIzNmFkOVY4S0dOdVlhYjZOTEFjR3VHbjlGZm1kSld3SWpqbkdpS015eDh3b0pUdGcvMGdyUmsxQ1h6aXpTd2U1R2ppRStMcS80dWNuVnFINzVQS1Y1V2FRYldhWS9DYXBrcGVBZnUvK0d2eTk4OWVDcWN3Nmc2aGpZVHlGQU00RGkwbE11Wkk4NDIxWGhNVmtITURLejR6M1p3T2V0WnRDNXRHL0FRVUdwcDhjckZCc3NRUTdiNHJ4Q25qeEwwcjJrblBiVUxRUjZzYVZpK2NIZC95S1ZDNjg3QXZWVm54bnZiZHFkdGhmL08wMHNOQTF6aXk5R3NZbC9GdkpvNWZ1bTZVT0IxUGc1ND0tLUJZbmhpYVJvK0M4RUN4RjFja1p4NHc9PQ==--f20c0737cecc8f88d689cb6fc061637243c56f0f"
            },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET"
        });

        if (!response.ok) {
            throw new Error(`Erreur ${response.status}: Impossible de récupérer les données`);
        }

        const data = await response.json();
        return parse(data); // On applique le parsing ici

    } catch (error) {
        console.error(`Erreur lors de la récupération des données pour ${legoID}:`, error);
        return [];
    }
}

module.exports = fetchVintedData;