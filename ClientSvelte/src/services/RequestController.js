import axios from "axios";
import { auth, LocalStorage as LS } from "../stores";

const api = __app_API_URL;

export const Request = async (path = `/`, method = `get`, data = null, params = null) => {
    try {
        const res = await axios({
            url: `${api}${path}`,
            method: method,
            data: data,
            params: params,
            headers: {
                'Authorization': `bearer ${LS.Get(`jwt`)}`
            }
        });

        return Promise.resolve({ ...res.data, status: res.status });
    } catch (err) {
        if (err.response.status == 401) {
            auth.set(false);
        }

        return Promise.reject({ ...err.response.data, status: err.response.status });
    }
};


//TODO: check 
export default {
    status: {
        ping: () => Request(`/status/ping/`, `get`),
        status: () => Request(`/status/`, `get`)
    },
    user: {
        login: ({ Email, Password }) => Request(`/user/login/`, `post`, { Email, Password }),
        register: ({ Email, Password, Firstname, Lastname }) => Request(`/user/register/`, `post`, { Email, Password, Firstname, Lastname }),
    },
    budget: {
        join: ({ BudgetID }) => Request(`/budget/join/${BudgetID}`, `get`),
        getList: () => Request(`/budget/`, `get`),
        get: ({ BudgetID }) => Request(`/budget/${BudgetID}`, `get`),
        create: ({ Name, InviteToken = null, Currency }) => Request(`/budget/`, `post`, { Name, InviteToken, Currency }),
        update: ({ BudgetID, Name = null, InviteToken = null, Currency = null }) => Request(`/budget/`, `patch`, { BudgetID, Name, InviteToken, Currency }),
        leave: ({ BudgetID }) => Request(`/budget/leave/`, `delete`, { BudgetID }),
        generateInviteToken: ({ BudgetID }) => Request(`/budget/token/`, `patch`, { BudgetID }),
        deactivateInviteToken: ({ BudgetID }) => Request(`/budget/token/`, `delete`, { BudgetID }),
    },
    plannedBudget: {
        getList: ({ BudgetID }) => Request(`/plannedBudget/${BudgetID}`, `get`),
        create: ({ BudgetID, DateStart, DateEnd, Title, Desctiption = null, PlannedAmount, Currency = null }) => Request(`/plannedBudget/${BudgetID}`, `post`, { DateStart, DateEnd, Title, Desctiption, PlannedAmount, Currency }),
        delete: ({ BudgetID, PlannedBudgetID }) => Request(`/plannedBudget/${BudgetID}`, `get`, { PlannedBudgetID }),
    },
    transaction: {
        getList: ({ BudgetID }) => Request(`/TransactionDescription/${BudgetID}`, `get`),
        getListUnderDays: ({ BudgetID, Days }) => Request(`/TransactionDescription/${BudgetID}/${Days}`, `get`),
        create: ({ BudgetID, Date = null, Notes = null, RecepitUrl = null, Amount, Currency = null, CategoryID }) => Request(`/TransactionDescription/${BudgetID}`, `post`, { Date, Notes, RecepitUrl, Amount, Currency, CategoryID }),
        delete: ({ BudgetID, TransactionID }) => Request(`/TransactionDescription/${BudgetID}`, `delete`, { TransactionID })
    },
    category: {
        getList: ({ BudgetID }) => Request(`/TransactionDescriptionCategory/${BudgetID}`, `get`),
        get: ({ BudgetID, CategoryID }) => Request(`/TransactionDescriptionCategory/${BudgetID}/${CategoryID}`, `get`),
        create: ({ BudgetID, Name, Income = null, Color, }) => Request(`/TransactionDescriptionCategory/${BudgetID}`, `post`, { Name, Income, Color }),
        update: ({ BudgetID, Name = null, Income = null, Color = null, }) => Request(`/TransactionDescriptionCategory/${BudgetID}`, `patch`, { Name, Income, Color }),
        delete: ({ BudgetID, CategoryID }) => Request(`/TransactionDescriptionCategory/${BudgetID}`, `delete`, { CategoryID }),
    },
    exchange: {
        all: () => Request(`/OldExchanger/all/`, `get`),
        avaliableCurrency: () => Request(`/OldExchanger/available/`, `get`),
        getCurrency: ({ from, to }) => Request(`/OldExchanger/one`, `get`, null, { from, to }),
        convert: ({ from, to, amount }) => Request(`/OldExchanger/convert`, `get`, null, { from, to, amount }),
    }
}
