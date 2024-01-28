const getWikipediaPageInfo = async (latitude, longitude) => {
    const apiUrl = 'http://localhost:3001/wikipedia'; // Use your server URL
    const params = new URLSearchParams({
        lat: latitude,
        lon: longitude,
    });

    try {
        const response = await fetch(`${apiUrl}?${params.toString()}`);
        const data = await response.json();

        // Process the Wikipedia API response
        console.log('Wikipedia Data:', data);

        if (data.query && data.query.pages) {
						console.log(data)	
            const firstPageId = Object.keys(data.query.pages)[0];
            const pageInfo = data.query.pages[firstPageId];

            console.log('Title:', pageInfo.title);
            console.log('Extract:', pageInfo.extract);

            return {
                title: pageInfo.title,
                extract: pageInfo.extract,
            };
        } else {
            console.log('No Wikipedia page found for the given coordinates.');
        	return {
				title: "Searched for: " + params.toString(),
        	    extract: "Maybe check your connection",
        	};
        }
    } catch (error) {
        console.error('Error fetching Wikipedia data:', error);
        return {
			title: "Wikipedia unreachable",
            extract: "Maybe check your connection",
        };
    }
};

export default getWikipediaPageInfo;