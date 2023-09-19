import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllComputers } from "../../redux/actions";
import { Card, TextField, Button } from "@mui/material";
import ComputerCard from "../ComputerCard/ComputerCard";

export default function Computers() {
  const dispatch = useDispatch();
  const allComputers = useSelector((state) => state.computers);

  const [searchValue, setSearchValue] = useState("");
  const [filteredComputers, setFilteredComputers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filterComputers = useCallback(() => {
    const searchTerm = searchValue.toLowerCase();
    const filtered = allComputers.filter((computer) => {
      const clientInfo = computer.user.info.toLowerCase();
      const clientId = computer.userId.toLowerCase()
      return clientInfo.includes(searchTerm.toLowerCase()) || clientId.includes(searchTerm.toLowerCase());
    });
    setFilteredComputers(filtered);
  }, [searchValue, allComputers]);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    if (allComputers.length === 0) {
      dispatch(getAllComputers());
    }
  }, [dispatch, allComputers]);

  useEffect(() => {
    filterComputers();
  }, [searchValue, filterComputers]);

  const pageCount = Math.ceil(filteredComputers.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const displayedComputers = filteredComputers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Limitar el número de páginas mostradas a 10.
  const maxPagesToShow = 10;
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(
    pageCount,
    startPage + maxPagesToShow - 1
  );

  return (
    <div>
      <TextField
        label="Buscar por nombre o ID del cliente"
        variant="outlined"
        fullWidth
        value={searchValue}
        onChange={handleSearchChange}
      />
      <div>
        {Array.from({ length: endPage - startPage + 1 }).map((_, index) => (
          <Button
            key={index}
            onClick={() => handlePageChange(startPage + index)}
            variant={currentPage === startPage + index ? "contained" : "outlined"}
          >
            {startPage + index}
          </Button>
        ))}
      </div>
      {!searchValue && !displayedComputers.length && <h3>No hay computadoras</h3>}
      {displayedComputers.map((el) => {
        return (
          <Card variant="outlined" key={el.id}>
            <ComputerCard
              alias={el.alias}
              teamviewer_id={el.teamviewer_id}
              client={el.user.info}
              zone={el.zone}
              id={el.id}
              order={el.order}
            />
          </Card>
        );
      })}
      
    </div>
  );
}
