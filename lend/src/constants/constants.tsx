import { BigNumber } from "@ethersproject/bignumber";
import { ERC20Token } from "shared/lib/models/eth";
import { Assets } from "../store/types";
import { getAssetDecimals } from "../utils/asset";
import { CHAINID, getSubgraphqlURI } from "../utils/env";
import deployment from "./deployments.json";
import addresses from "shared/lib/constants/externalAddresses.json";
import wintermute from "../assets/icons/makers/wintermute.svg";
import folkvang from "../assets/icons/makers/folkvang.svg";
import ExternalLinkIcon from "../components/Common/ExternalLinkIcon";
import {
  PoolVersion,
  PoolAddressMap,
  PoolOptions,
} from "shared/lib/constants/lendConstants";
import { MAINNET_NAMES, NETWORKS } from "shared/lib/constants/constants";

export const secondsPerYear = 31536000;

export enum Chains {
  NotSelected,
  Ethereum,
}

export const getPoolChain = (pool: string): Chains => {
  return Chains.Ethereum;
};

export const getPoolNetwork = (pool: string): MAINNET_NAMES => {
  return "mainnet";
};

export const NATIVE_TOKENS = ["WETH"];
export const isNativeToken = (token: string): boolean =>
  NATIVE_TOKENS.includes(token);

const DepositDisabledPoolList: PoolOptions[] = ["folkvang"];

export const isDepositDisabledPool = (pool: PoolOptions): boolean =>
  DepositDisabledPoolList.includes(pool);

export const GAS_LIMITS: {
  [pool in PoolOptions]: Partial<{
    lend: { deposit: number; withdraw: number };
  }>;
} = {
  wintermute: {
    lend: {
      deposit: 80000,
      withdraw: 100000,
    },
  },
  folkvang: {
    lend: {
      deposit: 80000,
      withdraw: 100000,
    },
  },
};

/**
 * Used to check if pool of given version exists. Only used for v2 and above
 * @param poolOption
 * @returns boolean
 */
export const hasPoolVersion = (
  poolOption: PoolOptions,
  version: PoolVersion
): boolean => {
  return Boolean(PoolAddressMap[poolOption][version]);
};

export const EVM_BLOCKCHAIN_EXPLORER_NAME: Record<number, string> = {
  [CHAINID.ETH_MAINNET]: "Etherscan",
};

export const EVM_BLOCKCHAIN_EXPLORER_URI: Record<number, string> = {
  [CHAINID.ETH_MAINNET]: "https://etherscan.io",
};

export const getExplorerName = (chain: Chains) => {
  return EVM_BLOCKCHAIN_EXPLORER_NAME[CHAINS_TO_ID[chain]];
};

// Left here for compatibility purposes
export const getEtherscanURI = (chainId: number) =>
  EVM_BLOCKCHAIN_EXPLORER_URI[chainId as CHAINID];

export const getExplorerURI = (chain: Chains) => {
  return EVM_BLOCKCHAIN_EXPLORER_URI[CHAINS_TO_ID[chain]];
};

export const getSubgraphURIForVersion = (
  version: PoolVersion,
  chain: Chains
) => {
  return getSubgraphqlURI();
};

export const getAssets = (pool: PoolOptions): Assets => {
  return "USDC";
};

export const getDisplayAssets = (pool: PoolOptions): Assets => {
  return "USDC";
};

export const getMakerLogo = (pool: PoolOptions): string => {
  switch (pool) {
    case "wintermute":
      return wintermute;
    case "folkvang":
      return folkvang;
  }
};

export const PoolAllowedDepositAssets: { [pool in PoolOptions]: Assets[] } = {
  wintermute: ["USDC"],
  folkvang: ["USDC"],
};

export const PoolMaxDeposit: BigNumber = BigNumber.from(100000000).mul(
  BigNumber.from(10).pow(getAssetDecimals(getAssets("wintermute")))
);

export const PoolFees = {
  managementFee: "2",
  performanceFee: "10",
};

export const RibbonTokenAddress = deployment.mainnet.ribbontoken;

export const getERC20TokenAddress = (token: ERC20Token, chainId: number) => {
  const network = NETWORKS[chainId];
  return (addresses[network].assets as any)[token];
};

export const READABLE_CHAIN_NAMES: Record<Chains, string> = {
  [Chains.Ethereum]: "Ethereum",
  [Chains.NotSelected]: "No Chain Selected",
};

export const ENABLED_CHAINS: Chains[] = [Chains.Ethereum];

export const CHAINS_TO_NATIVE_TOKENS: Record<Chains, Assets> = {
  [Chains.Ethereum]: "WETH",
  [Chains.NotSelected]: "WETH",
};

export const CHAINS_TO_ID: Record<number, number> = {
  [Chains.Ethereum]: CHAINID.ETH_MAINNET,
};

export const ID_TO_CHAINS: Record<number, number> = {
  [CHAINID.ETH_MAINNET]: Chains.Ethereum,
};

const WEBAPP_SUBGRAPHS: [PoolVersion, Chains][] = [["lend", Chains.Ethereum]];

export const SUBGRAPHS_TO_QUERY: [PoolVersion, Chains][] = WEBAPP_SUBGRAPHS;

export const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";
export const COINGECKO_CURRENCIES: { [key in Assets]: string | undefined } = {
  WETH: "ethereum",
  USDC: "usd-coin",
  RBN: "ribbon-finance",
};

interface PoolDetails {
  name: string;
  bio: string | JSX.Element;
  contract: string;
  twitter: string;
  website: string;
}

export const PoolDetailsMap: Record<PoolOptions, PoolDetails> = {
  wintermute: {
    name: "Wintermute",
    bio: (
      <>
        <p>
          Wintermute is a leading global algorithmic trading firm and one of the
          largest players in digital asset markets.
        </p>
        <p>
          Founded in 2017, the company is one of the most tenured crypto-native
          trading firms. The company is led by Evgeny Gaevoy, founder and CEO,
          previously at Optiver, and a team of people with top-tier algo trading
          backgrounds from traditional markets, as well as blockchain experts.
        </p>
        <p>
          Wintermute is one of the largest market makers globally, running
          delta-neutral strategies covering over 70 exchanges and 200 tokens
          with an average daily trading volume of $5B. Wintermute also runs an
          OTC desk for institutional as well as crypto-native counterparties and
          is one of the largest providers of market-making services for
          blockchain projects.
        </p>
        <p>
          With a team of 100+ engineers, traders, and other professionals,
          Wintermute is on a mission to enable, empower and advance the truly
          decentralized world for more transparent, fair, and efficient markets
          and products. The company operates around the clock, with offices in
          London and Singapore.
        </p>
        <p>
          Wintermute is an active player in the ecosystem, it invests in,
          supports, and incubates Defi projects and overall supports builders of
          decentralized finance.
        </p>
        <p>
          The funds will be deployed in delta-neutral strategies for the
          proprietary trading business.
        </p>
      </>
    ),
    contract: "https://etherscan.io/address/" + deployment.mainnet.wintermute,
    twitter: "https://twitter.com/wintermute_t",
    website: "https://www.wintermute.com",
  },
  folkvang: {
    name: "Folkvang",
    bio: (
      <>
        <p>
          Folkvang is a native crypto trading firm. With their proprietary
          technology, they trade on all major crypto markets around the clock.
          Since they began trading, they have grown the team from two people in
          Asia in 2018 to a global team of nine core contributors.
        </p>
        <p>
          In March 2020, Folkvang became more official and took on investment
          from SBF to seriously scale up their capital base and trading
          operations. They have been a part of global on-screen crypto flows
          ever since, trading billions of dollars every day on all major coins
          and exchanges.
        </p>
        <p>
          As a quantitative trading firm, Folkvang employs a variety of trading
          strategies, ranging from low latency HFT arbitrage on the biggest
          markets to degen yield farming. They are best known for the former,
          where their market-neutral HFT strategies make money from
          market-making, arbitrage, funding, and basis.
        </p>
        <p>
          On a weekly basis, Folkvang have had zero drawdowns since their start
          in March 2019.
        </p>
      </>
    ),
    contract: "https://etherscan.io/address/" + deployment.mainnet.folkvang,
    twitter: "https://twitter.com/folkvangtrading",
    website: "https://folkvang.io",
  },
};

export const CreditRating: JSX.Element = (
  <>
    <p>
      Credora provides real-time privacy preserving portfolio risk metrics for
      lenders, and has built a Credit Evaluation Methodology for digital asset
      firms.
    </p>
    <p>
      The evaluation is split into three main parts, totaling{" "}
      <strong>[1000]</strong> points in aggregate, which is then converted to a
      letter rating:
    </p>
    <p>
      <strong>Operations and Due Diligence [200]</strong>: Evaluation of a
      borrower's corporate and operational risk
    </p>
    <p>
      <strong>Financial Analysis [400]</strong>: Evaluation of a borrower's
      reported financial data
    </p>
    <p>
      <strong>Risk Monitoring [400]</strong>: Real-time evaluation of a
      borrower's asset and liability visibility
    </p>
    <p>
      Credora relies on these underlying factors, as they have high correlation
      to a trading firm's creditworthiness. Through real-time credit evaluation,
      Credora infrastructure supports data-driven lending for any pool of
      capital. Credora infrastructure and credit evaluations have successfully
      facilitated over $850M in credit and currently monitors $3.85B in assets.
    </p>
    <p>
      Read more{" "}
      <a
        href="https://credora.gitbook.io/credit-methodology/SbLmTxogePkrzsF4z9IK"
        target="_blank"
        rel="noreferrer noopener"
      >
        here
        <ExternalLinkIcon />
      </a>
    </p>
  </>
);

export const Disclaimers: JSX.Element = (
  <>
    <p>
      <strong>Deposit Risk</strong>: You are aware of and accept that the USDC
      held in the Vault on your behalf is not subject to deposit insurance
      protection, investor insurance protection, or any other relevant
      protection in any jurisdiction.
    </p>
    <p>
      <strong>USDC Risk</strong>: You are aware of and accept the risk of using
      USDC in https://lend.ribbon.finance/app. We are not responsible for any
      losses due to any actions performed by the USDC Issuer (Circle Internet
      Financial, LLC.) At any point in time, the Issuer may, with or without
      notice, at its sole discretion, "block" this Vault Smart Contract address,
      associated addresses or your address. USDC may be permanently frozen,
      resulting in a loss of funds.
    </p>
    <p>
      <strong>Other Risks</strong>: You are aware of and accept the risks
      further detailed in the{" "}
      <a
        href="https://www.ribbon.finance/terms"
        target="_blank"
        rel="noreferrer noopener"
      >
        Terms and Conditions
      </a>{" "}
      and the{" "}
      <a
        href="https://www.ribbon.finance/policy"
        target="_blank"
        rel="noreferrer noopener"
      >
        Privacy Policy
      </a>
      .
    </p>
  </>
);
