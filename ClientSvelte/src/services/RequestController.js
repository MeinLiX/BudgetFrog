import axios from "axios";
import { LocalStorage as LS } from "../stores";

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
        if (res.data?.succeeded === false) {
            return Promise.reject({ ...res.data, status: res.status });
        }
        return Promise.resolve({ ...res.data });
    } catch (err) {
        if (err.response.status === 401) {
            LS.Set("jwt", null)
        }
        return Promise.reject({ ...err.response.data, status: err.response.status });
    }
};


export default {
    assistent: {
        AnalysesTransaction: ({ BudgetID }) => Request(`/assistant/analysis/${BudgetID}`, `get`),
        AnalysesTransactionPeriod: ({ BudgetID, Year, Month, IncludeBanks }) => Request(`/assistant/analysis/${BudgetID}/${Year}/${Month}/${IncludeBanks}`, `get`),
    },
    status: {
        ping: () => Request(`/status/ping/`, `get`),
        status: () => Request(`/status/`, `get`)
    },
    user: {
        me: () => Request(`/user/me/`, `get`),
        login: ({ Email, Password }) =>
            Request(`/user/login/`, `post`, { Email, Password }),
        register: ({ Email, Password, Firstname, Lastname }) =>
            Request(`/user/register/`, `post`, {
                Email, Password, Firstname, Lastname
            }),
    },
    budget: {
        join: ({ InviteToken }) => Request(`/budget/join/${InviteToken}`, `patch`),
        getList: () => Request(`/budget/`, `get`),
        get: ({ BudgetID }) => Request(`/budget/${BudgetID}`, `get`),
        create: ({ Name, InviteToken = null, Currency }) => Request(`/budget/`, `post`, { Name, InviteToken, Currency }),
        update: ({
            BudgetID,
            Name = null,
            InviteToken = null,
            Currency = null
        }) => Request(`/budget/`, `patch`, { BudgetID, Name, InviteToken, Currency }),
        leave: ({ BudgetID }) => Request(`/budget/leave/`, `delete`, { BudgetID }),
        generateInviteToken: ({ BudgetID }) => Request(`/budget/token/`, `patch`, { BudgetID }),
        deactivateInviteToken: ({ BudgetID }) => Request(`/budget/token/`, `delete`, { BudgetID }),
        bank: {
            add: ({
                BudgetID,
                MerchantID,
                MerchantPassword,
                CardNumber,
                BankType
            }) => Request(`/budget/${BudgetID}/bank`, `patch`, {
                MerchantID,
                MerchantPassword,
                CardNumber,
                BankType
            }),
            delete: ({
                BudgetID,
                BankCredentialID
            }) => Request(`/budget/${BudgetID}/bank`, `delete`, { BankCredentialID })

        }
    },
    plannedBudget: {
        getList: ({ BudgetID }) => Request(`/plannedBudget/${BudgetID}`, `get`),
        create: ({
            BudgetID,
            Title,
            PlannedAmount,
            DateStart = null,
            DateEnd = null,
            Desctiption = null,
            Currency = null,
            CategoryID = null
        }) => Request(`/plannedBudget/${BudgetID}`, `post`, {
            DateStart,
            DateEnd,
            Title,
            Desctiption,
            PlannedAmount,
            Currency,
            CategoryID
        }),
        setAmount: ({
            BudgetID,
            PlannedBudgetID,
            PlannedAmount
        }) => Request(`/plannedBudget/${BudgetID}/amount`, `patch`, { PlannedBudgetID, PlannedAmount }),
        delete: ({ BudgetID, PlannedBudgetID }) => Request(`/plannedBudget/${BudgetID}`, `delete`, { PlannedBudgetID }),
    },
    transaction: {
        getList: ({ BudgetID }) => Request(`/TransactionDescription/${BudgetID}`, `get`),
        getListPeriod: ({ BudgetID, Year, Month }) => Request(`/TransactionDescription/${BudgetID}/${Year}/${Month}`, `get`),
        create: ({
            BudgetID,
            Date = null,
            Notes = null,
            RecepitUrl = null,
            Amount,
            Currency = null,
            CategoryID
        }) => Request(`/TransactionDescription/${BudgetID}`, `post`, {
            Date,
            Notes,
            RecepitUrl,
            Amount,
            Currency,
            CategoryID
        }),
        delete: ({ BudgetID, TransactionID }) => Request(`/TransactionDescription/${BudgetID}`, `delete`, { TransactionID })
    },
    category: {
        getList: ({ BudgetID }) => Request(`/TransactionDescriptionCategory/${BudgetID}`, `get`),
        get: ({ BudgetID, CategoryID }) => Request(`/TransactionDescriptionCategory/${BudgetID}/${CategoryID}`, `get`),
        create: ({
            BudgetID,
            Name,
            Income = null,
            Color,
        }) => Request(`/TransactionDescriptionCategory/${BudgetID}`, `post`, { Name, Income, Color }),
        update: ({
            BudgetID,
            Name = null,
            Income = null,
            Color = null,
        }) => Request(`/TransactionDescriptionCategory/${BudgetID}`, `patch`, { Name, Income, Color }),
        delete: ({
            BudgetID,
            CategoryID
        }) => Request(`/TransactionDescriptionCategory/${BudgetID}`, `delete`, { CategoryID }),
    },
    exchange: {
        all: () => Request(`/OldExchanger/all/`, `get`),
        avaliableCurrency: () => Request(`/OldExchanger/available/`, `get`),
        getCurrency: ({ from, to }) => Request(`/OldExchanger/one`, `get`, null, { from, to }),
        convert: ({ from, to, amount }) => Request(`/OldExchanger/convert`, `get`, null, { from, to, amount }),
    },
    photo: {
        get: async (keyWord) => (await axios({
            url: `https://api.pexels.com/v1/search?query=${keyWord}`,
            headers: { 'Authorization': `563492ad6f91700001000001fcfc7adab515422e997cdd57f04b5853` }
        })).data.photos[Math.floor(Math.random() * 15)].src.original
    }
}
