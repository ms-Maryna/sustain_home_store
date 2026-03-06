import React, {useState, useEffect} from "react"
import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"

export const Profile = () =>
{
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [profileImage, setProfileImage] = useState(null)
    const [preview, setPreview] = useState("")

    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    // load user profile
    useEffect(() =>
    {
        axios.get(`${SERVER_HOST}/users/profile`,
        {
            headers: {authorization: localStorage.token}
        })
        .then(res =>
        {
            setName(res.data.name)
            setEmail(res.data.email)
            setPhone(res.data.phone || "")
            setAddress(res.data.address || "")

            if(res.data.image)
            {
                setPreview(`${SERVER_HOST}/uploads/${res.data.image}`)
            }
        })
        .catch(err =>
        {
            if(err.response)
            {
                setErrorMessage(err.response.data)
            }
        })

    }, [])


    const handleImageChange = e =>
    {
        const file = e.target.files[0]

        if(file)
        {
            setProfileImage(file)
            setPreview(URL.createObjectURL(file))
        }
    }


    const handleSubmit = e =>
    {
        e.preventDefault()

        setErrorMessage("")
        setSuccessMessage("")

        if(name.trim().length < 2)
        {
            setErrorMessage("Name must be at least 2 characters")
            return
        }

        const formData = new FormData()

        formData.append("name", name)
        formData.append("phone", phone)
        formData.append("address", address)

        if(profileImage)
        {
            formData.append("image", profileImage)
        }

        axios.put(`${SERVER_HOST}/users/profile`,
        formData,
        {
            headers:
            {
                authorization: localStorage.token,
                "Content-Type": "multipart/form-data"
            }
        })
        .then(res =>
        {
            setSuccessMessage("Profile updated successfully")
        })
        .catch(err =>
        {
            if(err.response)
            {
                setErrorMessage(err.response.data)
            }
        })
    }


    return (
        <div className="form-container">

            <h2>My Profile</h2>

            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <form onSubmit={handleSubmit}>

                <label>Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    disabled
                />

                <label>Phone</label>
                <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                />

                <label>Address</label>
                <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                />

                <label>Profile Photo</label>
                <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleImageChange}
                />

                {preview &&
                    <div style={{marginTop:"10px"}}>
                        <img
                            src={preview}
                            alt="profile preview"
                            style={{width:"120px", borderRadius:"8px"}}
                        />
                    </div>
                }

                <br/>

                <button type="submit">Update Profile</button>

            </form>

        </div>
    )
}