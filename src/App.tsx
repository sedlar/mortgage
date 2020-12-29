import React, {useState} from 'react';
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
import IntField from "./IntField";

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 550,
  },
});

function formatNumber(value: number): string {
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

interface CalendarRowProps {
    id: number
    year: number
    month: number,
    payback: number,
    interest: number,
    realPayback: number,
    remainingAmount: number,
    payedInterestCumulative: number,
    realPaybackCumulative: number
}

function App() {
    const classes = useStyles();
    const [totalAmount, setTotalAmount] = useState<number>(4000000)
    const [percentInterestRate, setPercentInterestRate] = useState<number>(1.81);
    const [interval, setInterval] = useState<number>(30);

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
    const totalPayed = paybacksCount * minimalMonthlyPayback;
    const totalInterest = totalPayed - totalAmount;
    const calendar: Array<CalendarRowProps> = []

    let remainingAmount = totalAmount;
    let payedInterestCumulative = 0;
    let realPaybackCumulative = 0;
    for (let i = 0; i < paybacksCount; i++) {
        const monthlyInterest = remainingAmount * monthlyInterestRate;
        const realPayback = minimalMonthlyPayback - monthlyInterest;
        remainingAmount = remainingAmount - realPayback;
        payedInterestCumulative = payedInterestCumulative + monthlyInterest;
        realPaybackCumulative = realPaybackCumulative + realPayback;
        calendar.push({
            id: i+1,
            year: Math.floor(i / 12) + 1,
            month: i % 12 + 1,
            payback: minimalMonthlyPayback,
            interest: monthlyInterest,
            realPayback: realPayback,
            remainingAmount: remainingAmount,
            payedInterestCumulative: payedInterestCumulative,
            realPaybackCumulative: realPaybackCumulative
        })
    }
    return (
        <Container className={classes.root}>
            <Grid container direction="column" spacing={4}>
                <Grid item>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6} lg={3}>
                            <IntField
                                label={"Výška úvěru"}
                                variant={"outlined"}
                                value={totalAmount}
                                setValue={setTotalAmount}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <IntField
                                label={"Úroková míra"}
                                variant={"outlined"}
                                value={percentInterestRate}
                                setValue={setPercentInterestRate}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <IntField
                                label={"Počet let splácení"}
                                variant={"outlined"}
                                value={interval}
                                setValue={setInterval}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
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
                                value={paybacksCount}
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
                    <TableContainer component={Paper} className={classes.container}>
                        <Table size={"small"} stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell align={"right"}>
                                       Číslo splátky
                                    </TableCell>
                                    <TableCell align={"right"}>Rok úvěru</TableCell>
                                    <TableCell align={"right"}>Měsíc úvěru</TableCell>
                                    <TableCell align={"right"}>Splátka</TableCell>
                                    <TableCell align={"right"}>Úrok</TableCell>
                                    <TableCell align={"right"}>Úmor</TableCell>
                                    <TableCell align={"right"}>Úvěr (zůstatek)</TableCell>
                                    <TableCell align={"right"}>Splacený úrok kumulativně</TableCell>
                                    <TableCell align={"right"}>Úmor kumulativně</TableCell>
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
                                        <TableCell align={"right"}>{formatNumber(item.interest)}</TableCell>
                                        <TableCell align={"right"}>{formatNumber(item.realPayback)}</TableCell>
                                        <TableCell align={"right"}>{formatNumber(item.remainingAmount)}</TableCell>
                                        <TableCell align={"right"}>{formatNumber(item.payedInterestCumulative)}</TableCell>
                                        <TableCell align={"right"}>{formatNumber(item.realPaybackCumulative)}</TableCell>
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
