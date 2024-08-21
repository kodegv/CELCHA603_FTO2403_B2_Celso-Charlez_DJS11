import {Show, Genre, ShowDetails} from './Interfaces'

export async function fetchShowsAndGenres(): Promise<{ shows: Show[], genres: Genre[] }> {
  try {
    // Fetching shows for preview
    const showsResponse = await fetch('https://podcast-api.netlify.app/shows');
    if (!showsResponse.ok) {
      throw new Error(`HTTP error! status: ${showsResponse.status}`);
    }
    const showsData = await showsResponse.json();

    // Get unique genre IDs from shows
    const uniqueGenreIds = Array.from(new Set(
      showsData.flatMap((show: Show) => show.genres)
    ));
    // console.log(uniqueGenreIds);

    // Fetch genres individually
    const genrePromises = uniqueGenreIds.map(id =>
      fetch(`https://podcast-api.netlify.app/genre/${id}`).then(res => res.json())
    );

    const genresData = await Promise.all(genrePromises);
    // console.log(genresData);

    return { shows: showsData, genres: genresData };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching shows and genres:', error.message);
    } else {
      console.error('Error fetching shows and genres:', error);
    }
    throw new Error('Error fetching shows and genres');
  }
}

export async function fetchShowDetails(id: string): Promise<ShowDetails> {
  try {
    const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const data = await response.json();
    // console.log(data)
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching show details:', error.message);
    } else {
      console.error('Error fetching show details:', error);
    }
    throw error;
  }
}