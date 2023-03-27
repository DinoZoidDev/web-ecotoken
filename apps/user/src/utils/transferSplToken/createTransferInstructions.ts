/*
 * Copyright (C) 2023 EcoToken Systems
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/* eslint-disable */
// @ts-nocheck
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
    TransactionInstruction,
    type AccountMeta,
    type PublicKey,
    type Signer,
} from "@solana/web3.js";
import BN from "bn.js";

import BufferLayout = require("buffer-layout");

export enum TokenInstruction {
    InitializeMint = 0,
    InitializeAccount = 1,
    InitializeMultisig = 2,
    Transfer = 3,
    Approve = 4,
    Revoke = 5,
    SetAuthority = 6,
    MintTo = 7,
    Burn = 8,
    CloseAccount = 9,
    FreezeAccount = 10,
    ThawAccount = 11,
    TransferChecked = 12,
    ApproveChecked = 13,
    MintToChecked = 14,
    BurnChecked = 15,
    InitializeAccount2 = 16,
    SyncNative = 17,
    InitializeAccount3 = 18,
    InitializeMultisig2 = 19,
    InitializeMint2 = 20,
}

/**
 * Construct a Transfer instruction
 *
 * @param source       Source account
 * @param destination  Destination account
 * @param owner        Owner of the source account
 * @param amount       Number of tokens to transfer
 * @param multiSigners Signing accounts if `owner` is a multisig
 * @param programId    SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
export function createTransferInstruction(
    source: PublicKey,
    destination: PublicKey,
    owner: PublicKey,
    amount: number,
    multiSigners: Signer[] = [],
    programId = TOKEN_PROGRAM_ID,
): TransactionInstruction {
    const dataLayout = BufferLayout.struct([
        BufferLayout.u8("instruction"),
        BufferLayout.blob(8, "amount"),
    ]);

    const keys = addSigners(
        [
            { pubkey: source, isSigner: false, isWritable: true },
            { pubkey: destination, isSigner: false, isWritable: true },
        ],
        owner,
        multiSigners,
    );

    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode(
        {
            instruction: TokenInstruction.Transfer,
            amount: new TokenAmount(amount).toBuffer(),
        },
        data,
    );

    return new TransactionInstruction({ keys, programId, data });
}

export function addSigners(
    keys: AccountMeta[],
    ownerOrAuthority: PublicKey,
    multiSigners: Signer[],
): AccountMeta[] {
    if (multiSigners.length) {
        keys.push({
            pubkey: ownerOrAuthority,
            isSigner: false,
            isWritable: false,
        });
        for (const signer of multiSigners) {
            keys.push({
                pubkey: signer.publicKey,
                isSigner: true,
                isWritable: false,
            });
        }
    } else {
        keys.push({
            pubkey: ownerOrAuthority,
            isSigner: true,
            isWritable: false,
        });
    }
    return keys;
}

class TokenAmount extends BN {
    /**
     * Convert to Buffer representation
     */
    toBuffer(): Buffer {
        const a = super.toArray().reverse();
        const b = Buffer.from(a);
        if (b.length === 8) {
            return b;
        }

        if (b.length >= 8) {
            throw new Error("TokenAmount too large");
        }

        const zeroPad = Buffer.alloc(8);
        b.copy(zeroPad);
        return zeroPad;
    }

    /**
     * Construct a TokenAmount from Buffer representation
     */
    static fromBuffer(buffer: Buffer): TokenAmount {
        if (buffer.length !== 8) {
            throw new Error(`Invalid buffer length: ${buffer.length}`);
        }

        return new BN(
            // @ts-ignore
            [...buffer]
                .reverse()
                .map((i) => `00${i.toString(16)}`.slice(-2))
                .join(""),
            16,
        );
    }
}
