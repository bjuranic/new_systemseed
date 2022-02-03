import React, { useEffect, useState } from "react";
import axios from "axios";

// Bootstrap Components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Pagination from 'react-bootstrap/Pagination';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const GiphyApp = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const [search, setSearch] = useState("");

  // API call
  useEffect(() => {
    const fetchData = async ()  => {
        try {
            const apiResults = await axios("https://api.giphy.com/v1/gifs/trending", {
            params: {
                api_key: "oOkjGhZtAyw9T2GXhYLk4SMKTqMJOh6a"
            }
            });
            setData(apiResults.data.data.sort(() => 0.5 - Math.random()));
        } catch (err) {
        }
    };

    fetchData();

    const timer = setInterval(() => {
        fetchData();
    }, 5000);
    return () => {
        clearInterval(timer);
    };

    
  }, []);

  // Render Images
  const renderImages = () => {
    return currentItems.map(responseFinal => {
        return (
            <Col xs={12} md={6} lg={4} key={responseFinal.id} className="mb-3">
                <Card className="h-100">
                    <div className="embed-responsive embed-responsive-16by9">
                        <img src={responseFinal.images.fixed_height.url}  className="card-img-top embed-responsive-item" alt={responseFinal.title} />
                    </div>
                    
                    <div className="card-body">
                        <h5 className="card-title">{responseFinal.title}</h5>
                    </div>
                </Card>
            </Col>
        );
    });
  };


  // Prev
  const goToPrevPage = () => {
    setCurrentPage((page) => page - 1);
  }

  // Next
  const goToNextPage = () => {
    setCurrentPage((page) => page + 1);
  }

  //Search Change
  const handleSearchChange = event => {
    setSearch(event.target.value);
  };

  //Search Submit
  const handleSubmit = async event => {
    event.preventDefault();

    try {
      const apiResults = await axios("https://api.giphy.com/v1/gifs/search", {
        params: {
          api_key: "oOkjGhZtAyw9T2GXhYLk4SMKTqMJOh6a",
          q: search,
          limit: 100
        }
      });
      setData(apiResults.data.data);
    } catch (err) {
    }

  };

  return (
    <Container>
        <div className="input-group mt-3 mb-3">
            <Form.Control value={search} onChange={handleSearchChange} type="text" placeholder="Search" />
            <Button onClick={handleSubmit} type="submit">Submit</Button>
        </div>
        
        <Row>
            {renderImages()}
        </Row>

        <Pagination className="justify-content-center">
            <Pagination.Prev onClick={goToPrevPage}>Prev</Pagination.Prev>
            <Pagination.Next onClick={goToNextPage}>Next</Pagination.Next>
        </Pagination>
    </Container>
  );
};

export default GiphyApp;