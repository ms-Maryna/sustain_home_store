import React, {useState, useEffect} from "react"
import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"

export const Profile = () =>
{
    const [user, setUser] = useState({})
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState("")

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    useEffect(() =>
    {
        axios.get(`${SERVER_HOST}/api/users/profile`,
        {
            headers:{authorization:localStorage.token}
        })
        .then(res =>
        {
            setUser(res.data)

            if(res.data.profileImage)
            {
                setPreview(`${SERVER_HOST}/uploads/${res.data.profileImage}`)
            }
        })
    },[])


    const handleChange = e =>
    {
        setUser({...user,[e.target.name]:e.target.value})
    }


    const handleImage = e =>
    {
        const file = e.target.files[0]

        if(file)
        {
            setImage(file)
            setPreview(URL.createObjectURL(file))
        }
    }


    const handleSubmit = e =>
    {
        e.preventDefault()

        const formData = new FormData()

        formData.append("name", user.name)
        formData.append("phone", user.phone)
        formData.append("address", user.address)

        if(image)
        {
            formData.append("profileImage", image)
        }

        axios.put(`${SERVER_HOST}/api/users/profile`, formData,
        {
            headers:
            {
                authorization:localStorage.token,
                "Content-Type":"multipart/form-data"
            }
        })
        .then(res =>
        {
            setSuccess("Profile updated successfully")
        })
        .catch(err =>
        {
            setError("Profile update failed")
        })
    }


    return(
        <div className="profilePage">

            <h2>My Profile</h2>

            {error && <div className="errorBox">{error}</div>}
            {success && <div className="successBox">{success}</div>}

            <div className="profileCard">

                <div className="profilePhoto">

                    {preview ?
                        <img src={preview} alt="profile"/>
                        :
                        <div className="noPhoto">No Photo</div>
                    }

                    
                    
                    <input
    type="file"
    name="profileImage"
    accept="image/png,image/jpeg"
    onChange={handleImage}
/>

                </div>


                <form onSubmit={handleSubmit} className="profileForm">

                    <label>Name</label>
                    <input
                        name="name"
                        value={user.name || ""}
                        onChange={handleChange}
                    />

                    <label>Email</label>
                    <input
                        value={user.email || ""}
                        disabled
                    />

                    <label>Phone</label>
                    <input
                        name="phone"
                        value={user.phone || ""}
                        onChange={handleChange}
                    />

                    <label>Address</label>
                    <input
                        name="address"
                        value={user.address || ""}
                        onChange={handleChange}
                    />

                    <button>Update Profile</button>

                </form>

            </div>

        </div>
    )
}