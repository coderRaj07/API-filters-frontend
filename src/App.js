import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/esm/Table';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/esm/Form';
import InputGroup from 'react-bootstrap/esm/InputGroup';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function App() {
  const [search, setSearch] = useState('');
  const [featured, setFeatured] = useState(false);
  const [price, setPrice] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Predefined array of prices
  const predefinedPrices = [154, 404, 501, 701, 204, 1154, 505, 304];

  const fetchData = async () => {
    setLoading(true);

    try {
      const params = {};
      if (search) params.search = search;
      if (featured) params.featured = featured;
      if (price) params.price = price;

      const response = await axios.get(
        'https://ela5l4r1wf.execute-api.ap-south-1.amazonaws.com/api',
        {
          params,
        }
      );

      if (response.data.status.code === 200) {
        setData(response.data.data);
      } else {
        console.error('API Error:', response.data.status.displayMessage);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [search, featured, price]);

  return (
    <div>
      <Container>
        <h1 className="text-center mt-4">Product Keeper</h1>
        <Form>
          <Form.Group className="mb-3">
            <Form.Control
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <InputGroup>
              <Form.Control
                as="select"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              >
                <option value="">All Prices</option>
                {predefinedPrices.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Form.Control>
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
          </Form.Group>
        </Form>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Featured</th>
              <th>Company</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4">Loading...</td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>{item.featured ? 'Yes' : 'No'}</td>
                  <td>{item.company}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Container>
    </div>
  );
}

export default App;
