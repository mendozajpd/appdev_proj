import axiosClient from './axios.config.js'

export const handleCreateAlbum = async ( mediaFiles,) => {
    const formData = new FormData();
    formData.append('is_published', 0);

    mediaFiles.forEach((file, index) => {
        formData.append(`songs[${index}]`, file);
        formData.append(`displayNames[${index}]`, file.displayName);
    });

    const token = localStorage.getItem("jwt_token");

    try {
        const response = await axiosClient.post(`/create/album/upload-songs`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        });

        console.log('Album created successfully', response.data);
        return response.data;

    } catch (error) {
        console.error('There was an error!', error);
        throw error;
    }
};

export const getAlbumDetails = async (albumID) => {
    try {
        const response = await axiosClient.get(`/album/${albumID}/details`);
        return response.data;
    } catch (error) {
        console.error('There was an error!', error);
        throw error;
    }
}


//   // CREATE ALBUM
//   const handleCreateAlbum = async (e) => {
//     e.preventDefault();
//     setIsCreateAlbumButtonDisabled(true);

//     if (!albumTitle) {
//       upload_failed('Album title is missing.');
//       setIsCreateAlbumButtonDisabled(false);
//       return;
//     }
//     if (!albumDescription) {
//       upload_failed('Album description is missing.');
//       setIsCreateAlbumButtonDisabled(false);
//       return;
//     }
//     if (!albumPhoto) {
//       upload_failed('Album photo is missing.');
//       setIsCreateAlbumButtonDisabled(false);
//       return;
//     }

//     if (mediaFiles.length === 0) {
//       upload_failed('No songs uploaded. Please upload at least one song.');
//       setIsCreateAlbumButtonDisabled(false);
//       return;
//     }

//     for (let file of mediaFiles) {
//       if (!file.displayName) {
//         upload_failed('Song title is missing.');
//         setIsCreateAlbumButtonDisabled(false);
//         return;
//       }
//     }

//     const formData = new FormData();
//     formData.append('album_name', albumTitle);
//     formData.append('album_description', albumDescription);
//     formData.append('album_photo', albumPhoto);
//     formData.append('is_published', 0);
//     // formData.append('release_date', releaseDate); 

//     mediaFiles.forEach((file, index) => {
//       formData.append(`songs[${index}]`, file);
//       formData.append(`displayNames[${index}]`, file.displayName);
//       const genres = selectedGenres[file.path] || [];
//       if (genres.length === 0) {
//         upload_failed(`The song ${file.name} does not have a genre.`);
//         setIsCreateAlbumButtonDisabled(false);
//         return;
//       }
//       genres.forEach((genre, genreIndex) => {
//         formData.append(`genres[${index}][${genreIndex}]`, genre.value);
//       });
//     });

//     const token = localStorage.getItem("jwt_token");


//     try {
//       const response = await axios.post(`${BACKEND_URL}/api/create/album/upload-songs`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       upload_success(response.data.message);
//       localStorage.removeItem('files');
//       handleClose();
//       resetUpload();
//     } catch (error) {
//       upload_failed(error.response.data.message);
//       setIsCreateAlbumButtonDisabled(false);
//       console.error('There was an error!', error);
//     }
//   };
