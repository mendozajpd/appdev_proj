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

export const getPodcasts = async () => {
    try {
        const response = await axiosClient.get('/podcasts');
        return response.data;
    } catch (error) {
        console.error('Error during getting podcasts:', error);
        throw error;
    }
}