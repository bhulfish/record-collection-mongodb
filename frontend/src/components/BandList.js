import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Navbar, Form, Table, Row, Col, Button } from 'react-bootstrap';
import http from '../http-common';

const BandList = () => {
    const [bands, setBands] = useState([]);
    const [currentBand, setCurrentBand] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);

    const [searchName, setSearchName] = useState("");

    const formatDate = (date) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(date).toLocaleDateString(undefined, options)
    };

    const setActiveBand = (band, index) => {
        setCurrentBand(band);
        setCurrentIndex(index);
    };

    const getAllBands = () => {
        http.get("/bands")
            .then((response) => {
                console.log("getAllBands response:", response.data);
                setBands(response.data.bands);
            })
            .catch((err) => {
                console.log("getAllBands error:", err);
            });

        setCurrentBand(null);
        setCurrentIndex(-1);
        setSearchName("");
    };

    const searchBandsByName = (name) => {
        http.get(`/bands?band_name=${name}`)
            .then((response) => {
                console.log("searchBandsByName response:", response.data);
                setBands(response.data.bands);
            })
            .catch((err) => {
                console.log("searchBandsByName error:", err)
            });

        setCurrentBand(null);
        setCurrentIndex(-1);
    };

    const removeBandById = async (id) => {
        await http.delete(`/bands/${id}`)
            .then((response) => {
                console.log("removeBandById response:", response.data);
            })
            .catch((err) => {
                console.log("removeBandById error:", err);
            })

        if (searchName) {
            searchBandsByName(searchName);
        } else {
            getAllBands();
        }
    };

    const removeAllBands = async () => {
        await http.delete("/bands")
            .then((response) => {
                console.log("removeAllBands response:", response.data);
            })
            .catch((err) => {
                console.log("removeAllBands error:", err);
            });

        getAllBands();
    };

    useEffect(() => {
        getAllBands();
    }, []);

    return (
        <div>
            <Navbar className="mb-3 bg-body-tertiary justify-content-between">
                <Container>
                    <Form inline="true">
                        <Button as={NavLink} size="sm" variant="primary" to={"create"}>Add Band</Button>
                    </Form>
                    <Form inline="true">
                        <Row>
                            <Col xs="auto"><Form.Control type="text" size="sm" placeholder="Search by name" value={searchName} onChange={(e) => setSearchName(e.target.value)}/></Col>
                            <Col xs="auto"><Button type="button" size="sm" variant="primary" onClick={() => searchBandsByName(searchName)}>Search</Button></Col>
                            <Col xs="auto"><Button type="button" size="sm" variant="warning" onClick={() => getAllBands()}>Reset</Button></Col>
                        </Row>
                    </Form>
                </Container>
            </Navbar>

            <Row>
                <Col xs={6}>
                        <div>
                            <Table bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th>Band Name</th>
                                        <th># Albums</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { bands && bands.sort((a, b) => a.name.localeCompare(b.name)).map((band, index) => (
                                        <tr key={index} className={currentIndex === index ? "table-primary" : "table-default"} onClick={(e) => setActiveBand(band, index)}>
                                            <td>{band.name}</td>
                                            <td>{band.albums.length}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            { bands.length !== 0 && <Button type="button" size="sm" variant="danger" onClick={() => removeAllBands()}>Remove All</Button> }
                        </div>
                </Col>

                <Col xs={1}></Col>

                <Col xs={4}>
                    { currentBand ? (
                        <div>
                            <h4>Band Info</h4>
                            <div className="mb-2">
                                <label><strong>Band Name:</strong></label>{" "}
                                {currentBand.name}
                            </div>
                            { currentBand.albums.length !== 0 &&
                                <div className="mb-2">
                                    <h5>Album Info</h5>
                                    <Table bordered size="sm">
                                        <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>Release Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { currentBand.albums.map((album, index) => (
                                                <tr key={index}>
                                                    <td>{album.title}</td>
                                                    <td>{formatDate(album.release_date)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            }
                            <Row className="justify-content-between">
                                <Col xs="auto"><Button as={NavLink} size="sm" variant="warning" to={`update/${currentBand._id}`}>Update</Button></Col>
                                <Col xs="auto"><Button type="button" size="sm" variant="danger" onClick={() => removeBandById(currentBand._id)}>Remove</Button></Col>
                            </Row>
                        </div>
                    ) : (
                        <div>
                            { bands.length !== 0 && <p>Click on band to display details ...</p> }
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default BandList;
