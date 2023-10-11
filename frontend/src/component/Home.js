import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios"
import { Button, Card, Col, Form, Row, ProgressBar } from "react-bootstrap"
import SearchIcon from "../assets/images/Frame.png";
import Logo from "../assets/images/Logo.png";
import Play from "../assets/images/Play.png";
import Pause from "../assets/images/Pause.png";
import Preview from "../assets/images/Preview.png";
import Detail from "../assets/images/Detail.png";
import Sound from "../assets/images/Sound.png";
import Forward from "../assets/images/Forward.png";
export default function Home() {
    const imageApi = "https://cms.samespace.com/assets/";

    const [isInputClicked, setInputClicked] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [data, setData] = useState([]);
    const [clicked, setClicked] = useState(false);
    const [forYou, setForYou] = useState(true);
    const [selectedSong, setSelectedSong] = useState(null);
    const [selectedCover, setSelectedCover] = useState(null);
    const [selectedName, setSelectedName] = useState("");
    const [selectedArtist, setSelctedArtist] = useState("");
    const audioRef = useRef(null)




    const handleSliderChange = (e) => {
        const newPosition = e.target.value;
        setCurrentTime(newPosition);
        audioRef.current.currentTime = newPosition;
    };

    const handleInputClick = () => {
        setInputClicked(true);
    };

    const handleInputBlur = () => {
        setInputClicked(false);
    };
    const handleTopTracks = () => {
        setClicked(true)
        setForYou(false)
    }
    const handleForYou = () => {
        setForYou(true)
        setClicked(false)
    }


    const handleSong = (song, cover, name, artist) => {
        setSelectedSong(song)
        setSelectedCover(cover)
        setSelectedName(name)
        setSelctedArtist(artist)
        setIsPlaying(true)
        console.log("song", selectedSong)


        if (selectedSong === song) {
            if (audioRef.current.paused) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        } else {
            setSelectedSong(song);
            audioRef.current.src = song;
            audioRef.current.play();
        }
    }


    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleEnded = () => {
        setIsPlaying(false);
    };
    const getApiData = () => {
        const musicApi = "https://cms.samespace.com/items/songs";
        const config = {
            headers: {
                "Content-Type": "application/json"
            },
        };
        axios
            .get(musicApi, config)
            .then((response) => {
                if (response.status === 200) {
                    // console.log("data", response.data.data)
                    setData(response.data.data)
                }
            }).catch((error) => {
                console.log(error)
            })

    }

    useEffect(() => {
        getApiData()
    }, [])


    const inputClassName = `search bg-transparent ${isInputClicked ? 'transparent-border' : 'transparent-border'}`;
    return (
        <>
            <div className="container-fluid bg-dark">
                <Row className=" border-none">
                    <Col sm={"auto"} md={3} xl={2} className="bg-transparent sticky-top border-none logo-col">
                        <div className=" logo d-flex flex-sm-column flex-row flex-nowrap bg-transparent sticky-top mt-3 mb-3">
                            <img className="mt-2" src={Logo} alt="logo"></img>

                            <div className="link-light mt-3 d-flex profile">
                                <i className="bi-person-circle h2"></i>
                            </div>
                        </div>
                    </Col>
                    <Col sm={"auto"} md={3} lg={4} className="mt-3 min-vh-100 bg-dark border-none">
                        <div className="row-sm trackList">
                            <div className="d-flex link-light tracks mb-3 mt-3">
                                <Button className={forYou ? "fadeBtn" : "bg-transparent border-0 activeBtn"} onClick={handleForYou}>
                                    <h4>For You</h4>
                                </Button>
                                <Button className={clicked ? "fadeBtn" : "bg-transparent border-0 activeBtn"} onClick={handleTopTracks}>
                                    <span><h4>Top Tracks</h4></span>
                                </Button>
                            </div>
                            <div className="searchDiv bg-transparent">
                                <Form>
                                    <div className="d-flex">
                                        <Form.Control className={inputClassName} type="search" placeholder="Search Song, Artist" onClick={handleInputClick}
                                            onBlur={handleInputBlur}></Form.Control>
                                        <Button className="search1 border-none bg-transparent"><img src={SearchIcon}></img></Button>
                                    </div>
                                </Form>
                            </div>
                            {!clicked ? (data.map((val, index) => {
                                // console.log("name", val.cover)
                                return (
                                    <>
                                        <Card key={val?.id} onClick={() => { handleSong(val.url, val.cover, val.name, val.artist) }} className="song-card link-light mt-3 mb-3">
                                            <div className="songItem align-items-center ">
                                                <div className="gap-3 d-flex ">
                                                    <img src={imageApi + val?.cover} alt="image"></img>
                                                    <div >
                                                        <span className="link-light">{val.name}</span>
                                                        <br />
                                                        <span>{val.artist}</span>
                                                    </div>
                                                </div>
                                                <span>05.34</span>
                                            </div>
                                        </Card>
                                    </>
                                )
                            })) : (data.map((val, index) => {
                                // console.log("name", val.name)
                                if (val.top_track) {
                                    return (
                                        <>
                                            <Card key={val?.id} onClick={() => { handleSong(val.url, val.cover, val.name, val.artist) }} className="song-card  link-light mt-3 mb-3">
                                                <div className="songItem align-items-center ">
                                                    <div className="gap-3 d-flex ">
                                                        <img src={imageApi + val.cover} alt="image"></img>
                                                        <div >
                                                            <span className="link-light">{val.name}</span>
                                                            <br />
                                                            <span>{val.artist}</span>
                                                        </div>
                                                    </div>
                                                    <span>05.34</span>
                                                </div>
                                            </Card>
                                        </>
                                    )
                                }

                            }))}


                        </div>
                    </Col>
                    <Col className="bg-dark d-flex align-items-center justify-content-center">
                        {selectedSong && selectedCover && selectedArtist && selectedName && < Card className="border-none  border-0 bg-dark link-light" >
                            <Col>
                                <div className="music-card ">
                                    <h4 className="link-light">{selectedName}</h4>
                                    <p>{selectedArtist}</p>
                                </div>
                            </Col>
                            <Col className="music-image mt-3 mb-3 ">
                                <img src={imageApi + selectedCover} alt="image" style={{ width: "480px", height: "480px" }}></img>
                            </Col>
                            <Col>
                                <input
                                    type="range"
                                    min="0"
                                    max={audioRef.current && audioRef.current.duration}
                                    value={currentTime}
                                    onChange={handleSliderChange}
                                    className="custom-slider mb-3"
                                />
                                <div className="d-flex justify-content-between align-items-center mt-3 mb-3">

                                    <Button className="icons">
                                        <img src={Detail} alt="Detail"></img>
                                    </Button>
                                    <div>
                                        <Button className="icons">
                                            <img src={Preview} alt="Detail"></img>
                                        </Button>
                                        <Button className="icons" onClick={() => { togglePlayPause(selectedSong) }}>
                                            <img src={isPlaying ? Pause : Play} alt="play/pause" />
                                        </Button>
                                        <audio ref={audioRef} onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)} onEnded={handleEnded} controls hidden>
                                            <source src={selectedSong} type="audio/mp3" />
                                        </audio>
                                        <Button className="icons">
                                            <img src={Forward} alt="Detail"></img>
                                        </Button>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <Button className="bg-transparent border-0">
                                            <img src={Sound} alt="Volume"></img>
                                        </Button>
                                    </div>
                                </div>


                            </Col>


                        </Card>}
                    </Col>

                </Row>

            </div >
        </>

    )
}