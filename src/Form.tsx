import {Grid, Switch, Typography} from "@material-ui/core";
import FloatField from "./FloatField";
import React from "react";
import IntField from "./IntField";

interface FormProps {
    totalAmount: number,
    setTotalAmount: (value: number) => void,
    percentInterestRate: number,
    setPercentInterestRate: (value: number) => void,
    interval: number,
    setInterval: (value: number) => void,
    monthlySavings: number,
    setMonthlySavings: (value: number) => void,
    recalculatePayback: boolean,
    setRecalculatePayback: (value: boolean) => void,
}

export default function Form({
                                 totalAmount,
                                 setTotalAmount,
                                 interval,
                                 setInterval,
                                 percentInterestRate,
                                 setPercentInterestRate,
                                 monthlySavings,
                                 setMonthlySavings,
    recalculatePayback, setRecalculatePayback
                             }: FormProps) {
    return (<Grid container spacing={4}>
        <Grid item xs={12} md={6} lg={2}>
            <IntField
                label={"Výška úvěru"}
                variant={"outlined"}
                value={totalAmount}
                setValue={setTotalAmount}
                fullWidth
            />
        </Grid>
        <Grid item xs={12} md={6} lg={2}>
            <FloatField
                label={"Úroková míra"}
                variant={"outlined"}
                value={percentInterestRate}
                setValue={setPercentInterestRate}
                fullWidth
            />
        </Grid>
        <Grid item xs={12} md={6} lg={2}>
            <IntField
                label={"Počet let splácení"}
                variant={"outlined"}
                value={interval}
                setValue={setInterval}
                fullWidth
            />
        </Grid>
        <Grid item xs={12} md={6} lg={2}>
            <IntField
                label={"Měsíční úspory"}
                variant={"outlined"}
                value={monthlySavings}
                setValue={setMonthlySavings}
                fullWidth
            />
        </Grid>
            <Grid item xs={12} md={12} lg={4}>
                <Typography component="div">
        <Grid component="label" container alignItems="center" spacing={1}>
          <Grid item>Zachovat splátku</Grid>
          <Grid item>
            <Switch checked={recalculatePayback} onChange={event => setRecalculatePayback(event.target.checked)} name="checkedC" />
          </Grid>
          <Grid item>Zachovat dobu splácení</Grid>
        </Grid>
      </Typography>
            </Grid>
    </Grid>
    )
}