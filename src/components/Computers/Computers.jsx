import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllComputers
} from "../../redux/actions";
import { Card }  from '@mui/material'

import ComputerCard from "../ComputerCard/ComputerCard";

export default function Computers() {

    const dispatch = useDispatch();
    const allComputers = useSelector((state) => state.computers);

    useEffect(() => {
        if (allComputers.length === 0) {
        dispatch(getAllComputers());
      }
      }, [dispatch,allComputers]);

  return (
    <div>
      {!allComputers.length && <h3>No hay computadoras</h3>}
      {allComputers?.map((el) => {
        return (
        <Card variant="outlined">
          <ComputerCard
            key={el.id}
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
