import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css'; // Import DataTables CSS
import $ from 'jquery'; // Import jQuery
import 'datatables.net'; // Import DataTables library
import './styles.css';

export const CountryCatalogApp = () => {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const tableRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://restcountries.com/v3.1/all');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCountries(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (countries.length > 0) {
            if (!$.fn.DataTable.isDataTable(tableRef.current)) { // Check if DataTable is already initialized
                $(tableRef.current).DataTable({
                    responsive: true, // Enable responsive design
                    paging: true, // Enable pagination
                    searching: true, // Enable search functionality
                    ordering: true, // Enable column ordering
                    info: true // Enable information display
                }); // Initialize DataTable
            }
        }

        return () => {
            // Cleanup function to destroy DataTable when component unmounts
            if ($.fn.DataTable.isDataTable(tableRef.current)) {
                $(tableRef.current).DataTable().destroy(true);
            }
        };
    }, [countries]);

    const getAllNativeNames = (country) => {
        const nativeNames = [];

        if (country.name.nativeName) {
            for (const languageCode of Object.keys(country.name.nativeName)) {
                const nativeName = country.name.nativeName[languageCode];
                const nativeNameString = `${languageCode}: ${nativeName.common} (${nativeName.official})`;
                nativeNames.push(nativeNameString);
            }
        }

        // Join native names with <br> tags
        return nativeNames.map((name, index) => (
            <React.Fragment key={index}>
                {name}
                {index !== nativeNames.length - 1 && <br />} {/* Add <br> if not the last element */}
            </React.Fragment>
        ));
    };

    const handleCountryClick = (country) => {
        setSelectedCountry(country);
        setShowModal(true);
    };

    return (
        <div className="container py-4">
            <h1 className="mb-4 text-center">List of Countries</h1>
            <div className="table-responsive">
                <table className="table table-striped table-bordered table-hover" ref={tableRef}>
                    <thead className="thead-dark text-center">
                        <tr style={{ verticalAlign: "middle" }}>
                            <th scope="col" style={{ width: "10%" }} className="text-center">Flag</th>
                            <th scope="col" style={{ width: "20%" }} className="text-center">Country</th>
                            <th scope="col" style={{ width: "10%" }} className="text-center">Character Country Code (cca2)</th>
                            <th scope="col" style={{ width: "10%" }} className="text-center">Character Country Code (cca3)</th>
                            <th scope="col" style={{ width: "20%" }} className="text-center">Native Names</th>
                            <th scope="col" style={{ width: "15%" }} className="text-center">Alternative Country Name (altSpellings)</th>
                            <th scope="col" style={{ width: "15%" }} className="text-center">Country Calling Codes (idd)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {countries.map(country => (
                            <tr key={country.cca2}>
                                <td style={{ textAlign: 'center' }}>
                                    <img
                                        src={`https://flagcdn.com/48x36/${country.cca2.toLowerCase()}.png`}
                                        width="48"
                                        height="36"
                                        alt={`${country.name.common} Flag`}
                                    />
                                </td>
                                <td style={{ cursor: 'pointer' }} onClick={() => handleCountryClick(country)}>{country.name.common}</td>
                                <td>{country.cca2}</td>
                                <td>{country.cca3}</td>
                                <td>{getAllNativeNames(country)}</td>
                                <td>{country.altSpellings ? country.altSpellings.join(', ') : ''}</td>
                                <td>
                                    <div><strong>Root:</strong> {country.idd.root}</div>
                                    <div><strong>Suffixes:</strong> {country.idd.suffixes ? country.idd.suffixes.join(', ') : ''}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            {showModal && selectedCountry && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header d-flex justify-content-between">
                                <h5 className="modal-title">{selectedCountry.name.common}</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>

                            <div className="modal-body">

                                <div><strong>Character Country Code (cca2):</strong> {selectedCountry.cca2}</div>
                                <div><strong>Character Country Code (cca3):</strong> {selectedCountry.cca3}</div>
                                <div><strong>Native Names:</strong> {getAllNativeNames(selectedCountry)}</div>
                                <div><strong>Alternative Country Name (altSpellings):</strong> {selectedCountry.altSpellings ? selectedCountry.altSpellings.join(', ') : ''}</div>
                                <div><strong>Country Calling Codes (idd):</strong></div>
                                <ul>
                                    {selectedCountry.idd.suffixes && selectedCountry.idd.suffixes.map((suffix, index) => (
                                        <li key={index}>{suffix}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CountryCatalogApp;
