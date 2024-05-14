import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Navbar, Form, Table, Row, Col, Button } from 'react-bootstrap';
import http from '../http-common';

const AlbumList = () => {
    const [albums, setAlbums] = useState([]);
    const [currentAlbum, setCurrentAlbum] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);

    const [searchTitle, setSearchTitle] = useState("");

    const formatDate = (date) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(date).toLocaleDateString(undefined, options)
    };

    const setActiveAlbum = (album, index) => {
        setCurrentAlbum(album);
        setCurrentIndex(index);
    };

    const getAllAlbums = () => {
        http.get("/albums")
            .then((response) => {
                console.log("getAllAlbums response:", response.data);
                setAlbums(response.data.albums);
            })
            .catch((err) => {
                console.log("getAllAlbums error:", err);
            });

        setCurrentAlbum(null);
        setCurrentIndex(-1);
        setSearchTitle("");
    };

    const searchAlbumsByTitle = (title) => {
        http.get(`/albums?album_title=${title}`)
            .then((response) => {
                console.log("searchAlbumsByTitle response:", response.data);
                setAlbums(response.data.albums);
            })
            .catch((err) => {
                console.log("searchAlbumsByTitle error:", err)
            });

        setCurrentAlbum(null);
        setCurrentIndex(-1);
    };

    const removeAlbumById = async (id) => {
        await http.delete(`/albums/${id}`)
            .then((response) => {
                console.log("removeAlbumById response:", response.data);
            })
            .catch((err) => {
                console.log("removeBaneById error:", err);
            })

        if (searchTitle) {
            searchAlbumsByTitle(searchTitle);
        } else {
            getAllAlbums();
        }
    };

    useEffect(() => {
        getAllAlbums();
    }, []);

    return (
        <div>
            <Navbar className="mb-3 bg-body-tertiary justify-content-between">
                <Container>
                    <Form inline="true">
                        <Button as={NavLink} size="sm" variant="primary" to={"create"}>Add Album</Button>
                    </Form>
                    <Form inline="true">
                        <Row>
                            <Col xs="auto"><Form.Control type="text" size="sm" placeholder="Search by title" value={searchTitle} onChange={(e) => setSearchTitle(e.target.value)}/></Col>
                            <Col xs="auto"><Button type="button" size="sm" variant="primary" onClick={() => searchAlbumsByTitle(searchTitle)}>Search</Button></Col>
                            <Col xs="auto"><Button type="button" size="sm" variant="warning" onClick={() => getAllAlbums()}>Reset</Button></Col>
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
                                        <th>Album Title</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { albums && albums.sort((a, b) => a.band.name.localeCompare(b.band.name) || a.release_date.localeCompare(b.release_date)).map((album, index) => (
                                        <tr key={index} className={currentIndex === index ? "table-primary" : "table-default"} onClick={(e) => setActiveAlbum(album, index)}>
                                            <td>{album.band.name}</td>
                                            <td>{album.title}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                </Col>

                <Col xs={1}></Col>

                <Col xs="auto">
                    { currentAlbum ? (
                        <div>
                            <h4>Album Info</h4>
                            <div className="mb-2">
                                <label><strong>Band Name:</strong></label>{" "}
                                {currentAlbum.band.name}
                            </div>
                            <div className="mb-2">
                                <label><strong>Album Title:</strong></label>{" "}
                                {currentAlbum.title}
                            </div>
                            <div className="mb-2">
                                <label><strong>Release Date:</strong></label>{" "}
                                {formatDate(currentAlbum.release_date)}
                            </div>
                            <Row className="justify-content-between">
                                <Col xs="auto"><Button as={NavLink} size="sm" variant="warning" to={`update/${currentAlbum._id}`}>Update</Button></Col>
                                <Col xs="auto"><Button type="button" size="sm" variant="danger" onClick={() => removeAlbumById(currentAlbum._id)}>Remove</Button></Col>
                            </Row>
                        </div>
                    ) : (
                        <div>
                            { albums.length !== 0 && <p>Click on album to display details ...</p> }
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default AlbumList;
