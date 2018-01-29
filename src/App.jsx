import React from 'react';
import './App.css';

class App extends React.Component {
    // props est un composant : renvoient des éléments React décrivant ce qui devrait apparaître à l'écran.
    constructor(props) {
        //super est utilisé afin d'appeler ou d'accéder à des fonctions définies sur l'objet parent
        super();
        this.series = [];
        this.episodes = [];
        this.state = {
            matchedSeries: [],
            loading: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.findEpisodesById = this.findEpisodesById.bind(this);
    }

    componentDidMount() {
    //methode appelee a la construction

        fetch('seriesList.json')
            .then(response => response.json()) //promesse
            .then(series => {
                //Nous avons recupere avec succes la liste des series, recuperons les episodes
                fetch('seriesEpisodesList.json')
                    .then(res => res.json())   //promesse
                    .then(episodes => {
                        this.series = series;
                        this.episodes = episodes;

                        this.setState({
                            loading: false
                        });
                    });
            })
            .catch(error => {
                console.log(error);
            })
            .then(() => {
                // alert("j'ai fait ce que j'ai pu");
            });
    }

    handleChange(e) {
        // si nous pouvons trouver une série qui contient la chaîne d'entrée
        let matched = [];

        if (e.target.value.length > 0) {
            this.series.forEach(serie => {
                if (serie.seriesName.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1) {

                    //La méthode indexOf() renvoie le premier indice pour lequel on trouve un élément donné dans un tableau. Si l'élément                       cherché n'est pas présent dans le tableau, la méthode renverra -1.

                    matched.push(serie);
                }
            });
        }

        this.setState({
            matchedSeries: matched
        });
    }

    findEpisodesById(id) {
        // fonction simple d'utilisation pour obtenir des episodes pour une serie par #id
        for (let i = 0; i < this.episodes.length; i++) {
            if (this.episodes[i].serie_id === id) {
                return this.episodes[i].episodes_list;
            }
        }

        // ne retourne rien si aucun n'est valide
        return [];
    }

    render() {
        // comme nous aurons quelques donnees, nous allons stocker la modification dans une variable
        let data;

        // charge les infos
        if (this.state.loading) {
            data = <div>Loading... <span className="loader">|</span></div>;
        } else {
            // affiche les resultats
            let matched = this.state.matchedSeries.map(serie => {
                let episodes_list = this.findEpisodesById(serie.id);
                // console.log(episodes_list);

                let episodes = episodes_list.map(episode => {
                    return (
                        <li key={episode.id}>
                            {episode.episodeName}
                        </li>
                    );
                });
                //liste des episodes de la ou les serie(s)
                return (
                    <li key={serie.id}>
                        {serie.seriesName}
                        <ul>
                            {episodes}
                        </ul>
                    </li>
                );
            });
            // si on ne trouve rien dans la variable MATCHED on affiche "Pas de résultat trouvé."
            if (matched.length === 0) {
                matched = <p>Pas de résultat trouvé.</p>;
            } else {
                // affiche ce qu'il y a dans la variable LET MATCHED
                matched = (
                    <ul>
                        {matched}
                    </ul>
                );
            }

            data = (
                <div>
                    <input placeholder="Entre le nom de ta série" type="text" id="seriesTitleSearch" onChange={this.handleChange} />
                    {matched}
                </div>
            )
        }

        // return final les donnees
        return (
            <div>
                {data}
            </div>
        )
    }
}


export default App;
