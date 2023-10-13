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
import Loader from "../../src/assets/images/loader.gif";
import Mute from "../../src/assets/images/mute.png";
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
    const [selectedCard, setSelectedCard] = useState("")
    const audioRef = useRef(null);
    const [errorOccurred, setErrorOccurred] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(null);
    const [searchItem, setSearchItem] = useState("")
    const [vol, setVolume] = useState(0.5)
    const [selectedBg, setSelectedBg] = useState("")
    const [songDuration, setSongDuration] = useState(0);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const toggleMute = () => {
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const handleVolumeChange = (event) => {
        const newVolume = parseFloat(event.target.value);
        audioRef.current.volume = newVolume;
        setVolume(newVolume);
    };

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
    const loadAudio = (songUrl) => {
        if (audioRef.current) {
            audioRef.current.src = songUrl;
            audioRef.current.load(); // Load the audio
            audioRef.current.play().catch(() => {
                setErrorOccurred(true);
            });
        }
    };

    const handleSong = (song, cover, name, artist, bgColor, index) => {
        const songIndex = data.findIndex(item => item.url === song);
        loadAudio(song)
        setSelectedSong(song)
        setSelectedCover(cover)
        setSelectedName(name)
        setSelctedArtist(artist)
        setSelectedBg(bgColor)
        setIsPlaying(true)
        setCurrentSongIndex(songIndex);
        setSelectedCard(index)
        console.log("song", selectedSong)


        if (selectedSong === song) {
            if (audioRef.current.paused) {
                audioRef.current.play().catch(() => {
                    setErrorOccurred(true);
                });
            } else {
                audioRef.current.pause();
            }
        } else {
            setSelectedSong(song);
            audioRef.current.src = song;
            audioRef.current.play().catch(() => {
                setErrorOccurred(true);
            });;
        }
    }
    const playNextSong = () => {
        if (data.length === 0) return; // Check if there are songs in the playlist
        const nextIndex = (currentSongIndex + 1) % data.length;
        const nextSong = data[nextIndex];
        handleSong(nextSong.url, nextSong.cover, nextSong.name, nextSong.artist);
    };

    const playPreviousSong = () => {
        if (data.length === 0) return; // Check if there are songs in the playlist
        const previousIndex = (currentSongIndex - 1 + data.length) % data.length;
        const previousSong = data[previousIndex];
        handleSong(previousSong.url, previousSong.cover, previousSong.name, previousSong.artist);
    };
    const handleSearch = (e) => {
        e.preventDefault()
        const filteredSongs = data.filter((val) =>

            val.name.toLowerCase().includes(searchItem.toLowerCase()) ||
            val.artist.toLowerCase().includes(searchItem.toLowerCase())
        );
        if (!filteredSongs) {

        }
        if (setSelectedSong(null)) {
            audioRef.current.src = ''; // Clear the audio src
            audioRef.current.pause();
            setCurrentTime(0);
        }

        setData(filteredSongs);


        setSearchItem("")
    }

    const handleVolume = (e) => {
        e.preventDefault()
        audioRef.current.volume = vol / 100;
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

    const handleOnError = () => {
        setErrorOccurred(true); // An error occurred
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
        const durations = {};
        data.forEach((song) => {
            const audio = new Audio(song.url);
            audio.addEventListener("loadedmetadata", () => {
                durations[song.url] = audio.duration;
                setSongDuration(durations);
            });
        });
    }, [])


    const inputClassName = `search bg-transparent ${isInputClicked ? 'transparent-border' : 'transparent-border'}`;
    // const selectedBgColor = selectedBg || 'bg-dark';


    return (
        <>
            <div className="container-fluid" style={{ backgroundColor: !selectedBg ? 'black' : selectedBg }}>
                <Row className=" border-none">
                    <Col sm={12} md={3} xl={2} className="border-none sticky-top logo-col" style={{ backgroundColor: !selectedBg ? 'black' : selectedBg }}>
                        <div className="d-flex flex-column h-100 bg-transparent">
                            <div className=" mt-3 logo d-flex flex-column bg-transparent">
                                <img className="mt-2" src={Logo} alt="logo"></img>
                            </div>

                            <div className="link-light d-flex profile logo mt-auto">
                                <i className="bi-person-circle h2"></i>
                            </div>
                        </div>

                    </Col>

                    <Col xs={12} sm={12} md={8} lg={4} className="mt-3 min-vh-100 bg-transparent border-none">
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
                                <Form onSubmit={handleSearch}>
                                    <div className="d-flex">
                                        <Form.Control
                                            className={inputClassName}
                                            type="search"
                                            placeholder="Search Song, Artist"
                                            value={searchItem}
                                            onClick={handleInputClick}
                                            onBlur={handleInputBlur}
                                            onChange={(e) => setSearchItem(e.target.value)}
                                        >
                                        </Form.Control>
                                        <Button type="submit" className="search1 border-none bg-transparent"><img src={SearchIcon}></img></Button>
                                    </div>
                                </Form>
                            </div>
                            {/* <div className="trackListItem"> */}
                            <Card className="bg-transparent link-light mt-3 mb-3">
                                {!clicked ? (data?.map((val, index) => {
                                    // console.log("name", val.cover)

                                    return (
                                        <>
                                            <Card key={val?.id} onClick={() => { handleSong(val?.url, val.cover, val.name, val.artist, val.accent, index) }} className={`song-card link-light ${index === selectedCard ? "selected-card" : ""}`}>
                                                <div className="songItem align-items-center ">
                                                    <div className="gap-3 d-flex ">
                                                        <img src={val.cover ? imageApi + val?.cover : Loader} alt="image"></img>
                                                        <div >
                                                            <span className="link-light">{val.name}</span>
                                                            <br />
                                                            <span><p className="opacity-50">{val.artist}</p></span>
                                                        </div>
                                                    </div>
                                                    <span>{(parseFloat(songDuration[val.url] / 60).toFixed(2))}</span>
                                                </div>
                                            </Card>
                                        </>
                                    )
                                })) : (data?.map((val, index) => {
                                    // console.log("name", val.name)
                                    if (val.top_track) {
                                        return (
                                            <>
                                                <Card key={val?.id} onClick={() => { handleSong(val?.url, val.cover, val.name, val.artist) }} className="song-card  link-light">
                                                    <div className="songItem align-items-center ">
                                                        <div className="gap-3 d-flex ">
                                                            <img src={imageApi + val.cover} alt="image"></img>
                                                            <div >
                                                                <span className="link-light">{val.name}</span>
                                                                <br />
                                                                <span><p className="opacity-50">{val.artist}</p></span>
                                                            </div>
                                                        </div>
                                                        <span>{songDuration.toFixed(2)}</span>
                                                    </div>
                                                </Card>
                                            </>
                                        )
                                    }

                                }))}
                            </Card>
                        </div>
                        {/* </div> */}
                    </Col>
                    <Col className="bg-transparent d-flex align-items-center justify-content-center mb-5 pt-3  mt-md-5">
                        {selectedSong && selectedCover && selectedArtist && selectedName && (< Card className="border-none  border-0 bg-transparent link-light" >
                            <Col className="mt-3 mt-md-4">
                                <div className="music-card  ">
                                    <h4 className="link-light">{selectedName}</h4>
                                    <p className="opacity-50">{selectedArtist}</p>
                                </div>
                            </Col>
                            <Col className="music-image justify-content-center mt-3 mb-3 ">
                                <img src={selectedCover ? imageApi + selectedCover : Loader} alt="image" className="img-fluid fixed-image "></img>
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
                                        <Button className="icons  opacity-50" onClick={playPreviousSong}>
                                            <img src={Preview} alt="Detail"></img>
                                        </Button>
                                        <Button className="icons" onClick={() => { togglePlayPause(selectedSong) }}>
                                            <img src={isPlaying ? Pause : Play} alt="play/pause" />
                                        </Button>

                                        <audio
                                            ref={audioRef}
                                            onError={handleOnError}
                                            onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
                                            onEnded={handleEnded}
                                            controls
                                            hidden>
                                            <source src={selectedSong === null ? Loader : selectedSong} type="audio/mp3" />
                                        </audio>
                                        <Button className="icons" onClick={playNextSong} >
                                            <img src={Forward} alt="Detail"></img>
                                        </Button>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        {/* <input id="volId" type="range" min={0} value={vol} onChange={(e) => e.target.value} /> */}

                                        <Button className="bg-transparent border-0" onClick={toggleMute}>
                                            <img src={Sound} alt="Volume"></img>
                                        </Button>
                                    </div>
                                </div>


                            </Col>


                        </Card>)}
                    </Col>

                </Row>

            </div >
        </>

    )
}