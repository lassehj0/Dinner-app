import React, { useState, useEffect } from 'react';
import axios from 'c:/Users/Lasse/OneDrive/Dokumenter/Programming/Dinner-app/Dinner-app/Dinner-app/dinner-app/node_modules/axios/index.js';
import cheerio from 'cheerio';
import './App.css';

function App() {
	type recipe = {
		name: string;
		ingredients: string[];
	};

	const AxiosInstance = axios.create();
	const [url, setUrl] = useState('https://www.valdemarsro.dk/opskrifter/');
	const [recipes, setRecipes] = useState<recipe[]>(() => []);

	useEffect(() => {
		console.log(url);
		AxiosInstance.get(url)
			.then((response) => {
				const html = response.data;
				const $ = cheerio.load(html);
				const statsTable = $('.post-list-item-title > a');
				const nextPageLink = $('.pagenav-new > div > a');

				statsTable.each((i, elem) => {
					var recipeName: string = $(elem).text();
					const index: number = recipeName.indexOf('-');
					recipeName =
						index !== -1 ? recipeName.substring(0, index) : recipeName;

					var dishPageLink = $(elem).attr('href')!;
					const tempAxiosInstance = axios.create();
					tempAxiosInstance
						.get(dishPageLink)
						.then((resp) => {
							const dishHtml = resp.data;
							const $ = cheerio.load(dishHtml);
							const ingredientlist = $('.ingredientlist > li');
							var ingredientArr: string[] = new Array();

							ingredientlist.each((i, eleme) => {
								ingredientArr.push($(eleme).text());
							});

							setRecipes((prevRecipes) => [
								...prevRecipes,
								{ name: recipeName, ingredients: ingredientArr },
							]);
						})
						.catch(console.error);
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
				{recipes.map((elem, index) => {
					return (
						<>
							<li className='list-item' id={'Recipe nr.' + index} key={index}>
								{elem.name}
							</li>
							<ul>
								{elem.ingredients.map((eleme, i) => {
									return (
										<li className='list-item' id={'Recipe nr.' + index}>
											{eleme}
										</li>
									);
								})}
							</ul>
						</>
					);
				})}
			</ul>
		</>
	);
}

export default App;
