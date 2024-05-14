import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Row, Col, Button } from 'react-bootstrap';
import http from '../http-common';

const Band = () => {
    const params = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({ band_name: "" });

    const setFormField = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const getBandById = (id) => {
        http.get(`bands/${id}`)
            .then((response) => {
                console.log("getBandById response:", response.data);
                setForm({ band_name: response.data.band.name });
            })
            .catch((err) => {
                console.log("getBandById error:", err);
            });
    };

    const submitChanges = async () => {
        if (params.id) {
            await http.patch(`/bands/${params.id}`, form)
                .then((response) => {
                    console.log("submitChanges update response:", response.data);
                })
                .catch((err) => {
                    console.log("submitChanges update error:", err);
                });
        } else {
            await http.post("/bands", form)
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
        setForm({ band_name: "" });
        navigate("/bands");
    };

    useEffect(() => {
        if (params.id) {
            getBandById(params.id);
        }
    }, []);
    
    return (
        <div>
            <h3 className="text-center">{ params.id ? "Update Current" : "Create New" } Band</h3>
            <Form className="mx-auto p-3 bordered rounded shadow" style={{ width: "400px" }}>
                <Form.Group className="mb-3" controlId="formBandName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" size="sm" placeholder="Enter band name" value={form.band_name} onChange={(e) => setFormField("band_name", e.target.value)} />
                </Form.Group>

                <Row className="justify-content-between">
                    <Col xs="auto"><Button type="button" size="sm" variant="primary" onClick={() => submitChanges()}>Submit</Button></Col>
                    <Col xs="auto"><Button type="button" size="sm" variant="warning" onClick={() => cancelChanges()}>Cancel</Button></Col>
                </Row>
            </Form>
        </div>
    )
};

export default Band;
