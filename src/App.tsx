import React, {useEffect, useState} from 'react';
import {
    Container,
    Divider,
    Grid, makeStyles,
    Paper,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@material-ui/core";
import Form from "./Form"
import {Alert} from "@material-ui/lab";

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

function formatNumber(value: number): string {
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

interface CalendarRowProps {
    id: number
    year: number
    month: number,
    payback: number,
    extraPayback: number,
    interest: number,
    realPayback: number,
    remainingAmount: number,
    payedInterestCumulative: number,
    realPaybackCumulative: number
    currentSavings: number;
}

function App() {
    const classes = useStyles();
    const [totalAmount, setTotalAmount] = useState<number>(4000000)
    const [percentInterestRate, setPercentInterestRate] = useState<number>(1.81);
    const [interval, setInterval] = useState<number>(30);
    const [monthlySavings, setMonthlySavings] = useState<number>(40000);

    const interestRate = percentInterestRate / 100;
    const monthlyInterestRate = interestRate / 12;
    const paybacksCount = interval * 12;
    const minimalMonthlyPayback = (
        totalAmount *
        Math.pow(1 + monthlyInterestRate, paybacksCount) *
        (
            monthlyInterestRate /
            (Math.pow(1 + monthlyInterestRate, paybacksCount) - 1)
        )
    )

    if (monthlySavings < minimalMonthlyPayback) {
        return (<Container className={classes.root}>
                <Grid container direction="column" spacing={4}>
                    <Grid item>
                        <Form totalAmount={totalAmount} setTotalAmount={setTotalAmount} interval={interval} setInterval={setInterval} percentInterestRate={percentInterestRate} setPercentInterestRate={setPercentInterestRate} monthlySavings={monthlySavings} setMonthlySavings={setMonthlySavings} />
                    </Grid>
                    <Grid item>
                        <Alert severity={"error"}>Měsíční úspory musí být stejné nebo vyšší než měsíční splátka</Alert>
                    </Grid>
                </Grid>
            </Container>
        )
    }

    const calendar: Array<CalendarRowProps> = []

    let remainingAmount = totalAmount;
    let payedInterestCumulative = 0;
    let realPaybackCumulative = 0;
    let realPaybacksCount = 0;
    let currentSavings = 0;
    while (remainingAmount > 0 && realPaybacksCount < 360) {
        const monthlyInterest = remainingAmount * monthlyInterestRate;
        currentSavings += monthlySavings - minimalMonthlyPayback;
        const month = realPaybacksCount % 12 + 1
        let extraPayback = 0;
        if (month === 12) {
            extraPayback = currentSavings;
            currentSavings = 0;
        }
        const maxRealPayback = minimalMonthlyPayback + extraPayback - monthlyInterest;
        const realPayback = Math.min(maxRealPayback, remainingAmount);
        remainingAmount = remainingAmount - realPayback;
        payedInterestCumulative = payedInterestCumulative + monthlyInterest;
        realPaybackCumulative = realPaybackCumulative + realPayback;
        calendar.push({
            id: realPaybacksCount+1,
            year: Math.floor(realPaybacksCount / 12) + 1,
            month: month,
            payback: Math.min(minimalMonthlyPayback, remainingAmount + realPayback),
            extraPayback: Math.max(extraPayback, realPayback - minimalMonthlyPayback ),
            interest: monthlyInterest,
            realPayback: realPayback,
            remainingAmount: remainingAmount,
            payedInterestCumulative: payedInterestCumulative,
            realPaybackCumulative: realPaybackCumulative,
            currentSavings: currentSavings,
        })
        realPaybacksCount = realPaybacksCount+1;
    }
    const totalPayed = realPaybackCumulative + payedInterestCumulative;
    const totalInterest = payedInterestCumulative;
    return (
        <Container className={classes.root}>
            <Grid container direction="column" spacing={4}>
                <Grid item>
                    <Form totalAmount={totalAmount} setTotalAmount={setTotalAmount} interval={interval} setInterval={setInterval} percentInterestRate={percentInterestRate} setPercentInterestRate={setPercentInterestRate} monthlySavings={monthlySavings} setMonthlySavings={setMonthlySavings} />
                </Grid>
                <Grid item>
                    <Divider />
                </Grid>
                <Grid item>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6} lg={3}>
                            <TextField
                                label={"Měsíční splátka"}
                                variant={"outlined"}
                                value={formatNumber(minimalMonthlyPayback)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <TextField
                                label={"Počet splátek"}
                                variant={"outlined"}
                                value={realPaybacksCount}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <TextField
                                label={"Celkově zaplaceno"}
                                variant={"outlined"}
                                value={formatNumber(totalPayed)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <TextField
                                label={"Zaplacené úroky"}
                                variant={"outlined"}
                                fullWidth
                                value={formatNumber(totalInterest)}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <TableContainer component={Paper}>
                        <Table size={"small"}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align={"right"}>
                                       Číslo splátky
                                    </TableCell>
                                    <TableCell align={"right"}>Rok úvěru</TableCell>
                                    <TableCell align={"right"}>Měsíc úvěru</TableCell>
                                    <TableCell align={"right"}>Splátka</TableCell>
                                    <TableCell align={"right"}>Mimořádná splátka</TableCell>
                                    <TableCell align={"right"}>Úrok</TableCell>
                                    <TableCell align={"right"}>Úmor</TableCell>
                                    <TableCell align={"right"}>Úvěr (zůstatek)</TableCell>
                                    <TableCell align={"right"}>Splacený úrok kumulativně</TableCell>
                                    <TableCell align={"right"}>Úmor kumulativně</TableCell>
                                    <TableCell align={"right"}>Aktuální úspory</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {calendar.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell align={"right"}>
                                            {item.id}
                                        </TableCell>
                                        <TableCell align={"right"}>{item.year}</TableCell>
                                        <TableCell align={"right"}>{item.month}</TableCell>
                                        <TableCell align={"right"}>{formatNumber(item.payback)}</TableCell>
                                        <TableCell align={"right"}>{formatNumber(item.extraPayback)}</TableCell>
                                        <TableCell align={"right"}>{formatNumber(item.interest)}</TableCell>
                                        <TableCell align={"right"}>{formatNumber(item.realPayback)}</TableCell>
                                        <TableCell align={"right"}>{formatNumber(item.remainingAmount)}</TableCell>
                                        <TableCell align={"right"}>{formatNumber(item.payedInterestCumulative)}</TableCell>
                                        <TableCell align={"right"}>{formatNumber(item.realPaybackCumulative)}</TableCell>
                                        <TableCell align={"right"}>{formatNumber(item.currentSavings)}</TableCell>
                                    </TableRow>
                                ))}

                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Container>
    );
}

export default App;
