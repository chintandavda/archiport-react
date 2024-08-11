import React, { useEffect, useState } from "react";
import { Container, Grid, Card, CardMedia, CardContent } from "@mui/material";
import DesignPostAPI from "../../services/DesignPostAPI";

const AllDesigns = () => {
    const [designs, setDesigns] = useState([]);

    useEffect(() => {
        const fetchDesigns = async () => {
            try {
                const data = await DesignPostAPI.getDesigns();
                setDesigns(data);
            } catch (error) {
                console.error("Error fetching designs:", error);
            }
        };
        fetchDesigns();
    }, []);

    return (
        <Container>
            <Grid container spacing={4}>
                {designs.map((design) => (
                    <Grid item key={design._id} xs={12} sm={6} md={4}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="200"
                                image={`${design.image}`}
                                alt={design.caption}
                            />
                            <CardContent>
                                <h5>{design.caption}</h5>
                                <p variant="body2" color="textSecondary">
                                    Author: {design.username}
                                </p>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default AllDesigns;
