import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Select from 'react-select';

function App() {
  const [search, setSearch] = useState('');
  const [featured, setFeatured] = useState(false);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const predefinedPrices = [
    { value: 154, label: '154' },
    { value: 404, label: '404' },
    { value: 501, label: '501' },
    { value: 701, label: '701' },
    { value: 204, label: '204' },
    { value: 1154, label: '1154' },
    { value: 505, label: '505' },
    { value: 304, label: '304' },
  ];

  const fetchData = async () => {
    setLoading(true);

    try {
      const params = {};
      if (search) params.search = search;
      if (featured) params.featured = featured;
      if (selectedPrices.length > 0) {
        params.price = selectedPrices.map((price) => price.value);
      }

      const response = await axios.get(
        'https://ela5l4r1wf.execute-api.ap-south-1.amazonaws.com/api',
        {
          params,
          paramsSerializer: (params) => {
            return Object.entries(params)
              .map(([key, value]) => {
                if (Array.isArray(value)) {
                  return value.map((v) => `${key}=${v}`).join('&');
                }
                return `${key}=${value}`;
              })
              .join('&');
          },
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
  }, [search, featured, selectedPrices]);

  return (
    <div>
      <Container>
        <h1 className="text-center mt-4">Product Keeper</h1>
        <Form>
          <Form.Group className="mb-3">
            <Form.Control
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Name,Company"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price:</Form.Label>
            <Select
              options={predefinedPrices}
              isMulti
              value={selectedPrices}
              onChange={(selectedOptions) => setSelectedPrices(selectedOptions)}
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


