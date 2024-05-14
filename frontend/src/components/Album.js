import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Row, Col, Button } from 'react-bootstrap';
import http from '../http-common';

const Album = () => {
    const params = useParams();
    const navigate = useNavigate();

    const [bands, setBands] = useState([]);

    const [form, setForm] = useState({ album_title: "", release_date: "", band_id: 0 });

    const setFormField = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const formatDate = (date) => {
        if (date) {
            return new Date(date).toLocaleDateString("es-pa");
        }
        return;
    };

    const getAllBands = async () => {
        await http.get("/bands/dropdown")
            .then((response) => {
                console.log("getAllBands response:", response.data);
                setBands(response.data.bands);
            })
            .catch((err) => {
                console.log("getAllBands error:", err);
            });
    };

    const getAlbumById = (id) => {
        http.get(`/albums/${id}`)
            .then((response) => {
                console.log("getAlbumById response:", response.data);
                setForm({ album_title: response.data.album.title, release_date: formatDate(response.data.album.release_date), band: response.data.album.band._id })
            })
            .catch((err) => {
                console.log("getAlbumById error:", err);
            });
    };

    const submitChanges = async () => {
        if (params.id) {
            await http.patch(`/albums/${params.id}`, form)
                .then((response) => {
                    console.log("submitChanges update response:", response.data);
                })
                .catch((err) => {
                    console.log("submitChanges update error:", err);
                });
        } else {
            await http.post("/albums", form)
                .then((response) => {
                    console.log("submitChanges create response:", response.data);
                })
                .catch((err) => {
                    console.log("submitChanges create error:", err);
                });
        }

        clearFormAndReturn();
    };

    const cancelChanges = () => {
        clearFormAndReturn();
    };

    const clearFormAndReturn = () => {
        setForm({ album_title: "", release_date: "", band_id: 0 });
        navigate("/albums");
    };

    useEffect(() => {
        if (params.id) {
            getAlbumById(params.id);
        }
        getAllBands();
    }, []);
    
    return (
        <div>
            <h3 className="text-center">{ params.id ? "Update Current" : "Create New" } Album</h3>
            <Form className="mx-auto p-3 bordered rounded shadow" style={{ width: "400px" }}>
                <Form.Group className="mb-3" controlId="formBandId">
                    <Form.Label>Band</Form.Label>
                    <Form.Select size="sm" value={form.band_id} onChange={(e) => setFormField("band_id", e.target.value)}>
                        { !params.id && ( <option key="0" value="0">Select band name</option> )}
                        { bands && bands.sort((a,b) => a.name.localeCompare(b.name)).map((band, index) => (
                            <option key={index} value={band._id}>{band.name}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAlbumTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" size="sm" placeholder="Enter album title" value={form.album_title} onChange={(e) => setFormField("album_title", e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formReleaseDate">
                    <Form.Label>Release Date</Form.Label>
                    <Form.Control type="text" size="sm" placeholder="mm/dd/yyyy" value={form.release_date} onChange={(e) => setFormField("release_date", e.target.value)} />
                </Form.Group>

                <Row className="justify-content-between">
                    <Col xs="auto"><Button type="button" size="sm" variant="primary" onClick={() => submitChanges()}>Submit</Button></Col>
                    <Col xs="auto"><Button type="button" size="sm" variant="warning" onClick={() => cancelChanges()}>Cancel</Button></Col>
                </Row>
            </Form>
        </div>
    );
};

export default Album;
