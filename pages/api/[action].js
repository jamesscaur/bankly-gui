// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Bankly from 'bankly';

const { CLIENT_ID, CLIENT_SECRET, CLIENT_BRANCH, CLIENT_ACCOUNT_NUMBER, CLIENT_CNPJ, SANDBOX_CLIENT_ID, SANDBOX_CLIENT_SECRET, SANDBOX_CLIENT_ACCOUNT_NUMBER } = process.env;
export const sandbox = process.env.NODE_ENV !== 'production';

let bankly = !sandbox ? new Bankly(CLIENT_ID, CLIENT_SECRET) : new Bankly(SANDBOX_CLIENT_ID, SANDBOX_CLIENT_SECRET, 'sandbox')

const branch = CLIENT_BRANCH;
const accountNumber = !sandbox ? CLIENT_ACCOUNT_NUMBER : SANDBOX_CLIENT_ACCOUNT_NUMBER;
const cnpj = CLIENT_CNPJ;

const defaultAction = () => {
  return "Not Built Yet"
}

const getBalance = ({ branch, accountNumber }) => bankly.getBalance(branch, accountNumber)

const getStatement = ({ branch, accountNumber }) => bankly.getStatement(branch, accountNumber, 0, 20)

const getEvents = ({ branch, accountNumber }) => bankly.getEvents(branch, accountNumber, 1, 20)

const makePix = ({ cnpj }) => bankly._postJSON('/pix/qrcodes', {
  addressingKey: {
    type: "CNPJ",
    value: cnpj
  },
  location: {
    city: "São Paulo",
    zipCode: "01409001"
  },
  amount: 500,
  recipientName: "Easy Crypto",
  conciliationId: "TestOrderId",
  additionalData: "TestCoinInfo"
}).then(result => {
  const text = Buffer.from(result.encodedValue, 'base64').toString();
  return {
    text,
    link: `https://api.qrserver.com/v1/create-qr-code/?qzone=1&data=${text}`
  }
})

const actions = {
  "currentBalance": getBalance,
  "latestStatement": getStatement,
  "recentEvents": getEvents,
  "generatePix": makePix
}

export default async function handler(req, res) {
  if (!!req.query.action && Object.keys(actions).indexOf(req.query.action) !== -1) {
    const action = actions[req.query.action];
    try {
      const data = await action({ branch, accountNumber, cnpj });
      const json = {
        error: false,
        data
      };
      if (!res) {
        return json
      }
      res.status(200).json(json)
    } catch (error) {
      const json = {
        error: true,
        data: error.message
      };
      if (!res) {
        return json
      }
      res.status(500).json(json)
    }
  } else {
    const json = {
      error: true,
      data: "Function not found"
    };
    if (!res) {
      return json
    }
    res.status(404).json(json)
  }
}