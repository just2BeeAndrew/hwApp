import {Request} from "express";
import {SortDirection} from "mongodb";

export const paginationQueries = (req: Request) => {
    let searchNameTerm:string | null = req.query.searchNameTerm ? req.query.searchNameTerm.toString() : null;
    let sortBy:string = req.query.sortBy ? req.query.sortBy.toString() : "createdAt";
    let sortDirection: 'asc'|'desc' =
        req.query.sortDirection && req.query.sortDirection.toString() === 'asc'
            ? 'asc'
            : 'desc'
    let pageNumber: number = req.query.pageNumber ? +req.query.pageNumber : 1;
    let pageSize:number = req.query.pageSize ? +req.query.pageSize : 10;
    return {pageNumber, pageSize, sortBy, sortDirection, searchNameTerm};
}
