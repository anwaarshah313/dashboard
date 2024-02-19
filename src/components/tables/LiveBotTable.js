import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import "./LiveBotTable.css";
const https="http://192.168.233.193:9099"
export default function LiveBotTable() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchBotData = () => {
      fetch(https,'/api/calls/unique-bot-ids/')
        .then(response => response.json())
        .then(botIds => {
          Promise.all(botIds.map(botId =>
            fetch(https,`/api/calls/latest/${botId}`)
              .then(response => response.json())
              .then(data => ({
                botName: data.bot_id,
                lastTime: data.call_time,
                lastDis: data.call_disposition,
                msg: data.call_msg,
                number: data.call_phone_num,
              }))
          ))
          .then(newRows => {
            // Assuming botName is unique. Adjust according to your data structure.
            // This checks for existing rows and updates or adds accordingly.
            setRows(prevRows => {
              const updatedRows = newRows.map(newRow => {
                const existingRow = prevRows.find(row => row.botName === newRow.botName);
                return existingRow ? { ...existingRow, ...newRow } : newRow;
              });
              // Filter out any old rows not present in newRows, if necessary
              return updatedRows.filter(updatedRow => botIds.includes(updatedRow.botName));
            });
          });
        });
    };
  
    // Call fetchBotData immediately to load initial data
    fetchBotData();
  
    // Set up polling every second
    const intervalId = setInterval(fetchBotData, 10000);
  
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
    

  // Function to determine if time difference is more than 5 minutes
  const isTimeDiffMoreThanFiveMinutes = (lastTime) => {
    const currentTime = new Date();
    const lastTimeDate = new Date(lastTime);
    const diff = (currentTime - lastTimeDate) / (1000 * 60); // Difference in minutes
    return diff > 5;
  };

  return (
    <Box className="box">
      <TableContainer component={Paper} className="table-container">
        <Table sx={{ minWidth: 400 }} aria-label="a dense table" size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell className="table-head">S.No</TableCell>
              <TableCell className="table-head">Bot Name</TableCell>
              <TableCell className="table-head">Last Call</TableCell>
              <TableCell className="table-head">Latest Diposition</TableCell>
              <TableCell className="table-head">Status</TableCell>
              <TableCell className="table-head">Phone Number</TableCell>
            </TableRow>
          </TableHead>
          {rows? <>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell className="table-body">{index + 1}</TableCell>
                <TableCell className="table-body">{row.botName}</TableCell>
                <TableCell className="table-body">
                  {
                    isTimeDiffMoreThanFiveMinutes(row.lastTime) ? (
                      <Chip label={new Date(row.lastTime).toLocaleString()} color="error" />
                    ) : (
                      new Date(row.lastTime).toLocaleString()
                    )
                  }
                </TableCell>
                <TableCell className="table-body">{row.lastDis}</TableCell>
                <TableCell className="table-body">
                  {row.msg.status ? (
                    <Chip label={row.msg.content}/>
                  ) : (
                    <Chip label={row.msg.content} color="error" />
                  )}
                </TableCell>
                <TableCell className="table-body">{row.number}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          </> : <h2>loading</h2>}
        </Table>
      </TableContainer>
    </Box>
  );
}
