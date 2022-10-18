import React, { useState, useEffect } from 'react';
import axios from 'c:/Users/Lasse/OneDrive/Dokumenter/Programming/Dinner-app/Dinner-app/Dinner-app/dinner-app/node_modules/axios/index.js';
import cheerio from 'cheerio';
import './App.css';

function App() {
	const AxiosInstance = axios.create();
	const [names, setNames] = useState<string[]>(() => []);
	const [url, setUrl] = useState('https://www.valdemarsro.dk/opskrifter/');

	useEffect(() => {
		console.log(url);
		AxiosInstance.get(url)
			.then((response) => {
				const html = response.data;
				const $ = cheerio.load(html);
				const statsTable = $('.post-list-item-title > a');
				const nextPageLink = $('.pagenav-new > div > a');

				statsTable.each((i, elem) => {
					var name: string = $(elem).text();
					const index: number = name.indexOf('-');
					name = index !== -1 ? name.substring(0, index) : name;
					setNames((prevNames) => [...prevNames, name]);
				});

				if (nextPageLink)
					nextPageLink.each((i, elem) => {
						if ($(elem).text().indexOf('Næste') !== -1)
							setUrl($(elem).attr('href')!);
					});
			})
			.catch(console.error);
	}, [url]);

	return (
		<>
			<ul className='list'>
				{names.map((element, index) => {
					return (
						<div className='list-item' id={'Recipe nr.' + index} key={index}>
							<li>{element}</li>
						</div>
					);
				})}
			</ul>
		</>
	);
}

export default App;
