import express, { Request, Response, Router } from 'express'
import { MongoClient } from 'mongodb'
import { BackendAnchorGateway } from './BackendAnchorGateway'
import { IServiceResponse, isIAnchor, IAnchor } from '../types'

// eslint-disable-next-line new-cap
export const AnchorExpressRouter = express.Router()

/**
 * AnchorRouter uses AnchorExpressRouter (an express router) to define responses
 * for specific HTTP requests at routes starting with '/anchor'.
 * E.g. a post request to '/anchor/create' would create a anchor.
 * The AnchorRouter contains a BackendAnchorGateway so that when an HTTP request
 * is received, the AnchorRouter can call specific methods on BackendAnchorGateway
 * to trigger the appropriate response. See server/src/app.ts to see how
 * we set up AnchorRouter.
 */
export class AnchorRouter {
  BackendAnchorGateway: BackendAnchorGateway

  constructor(mongoClient: MongoClient) {
    this.BackendAnchorGateway = new BackendAnchorGateway(mongoClient)

    /**
     * Request to create anchor
     * TODO
     * @param req request object coming from client
     * @param res response object to send to client
     */
    AnchorExpressRouter.post('/create', async (req: Request, res: Response) => {
      try {
        const anchor = req.body.anchor
        console.log('[AnchorRouter] create')
        if (!isIAnchor(anchor)) {
          res.status(400).send('not IAnchor!')
        } else {
          const response = await this.BackendAnchorGateway.createAnchor(anchor)
          res.status(200).send(response)
        }
      } catch (e) {
        res.status(500).send(e.message)
      }
    })

    /**
     * Request to retrieve anchor by anchorId
     * TODO
     * @param req request object coming from client
     * @param res response object to send to client
     */
    AnchorExpressRouter.get('/:anchorId', async (req: Request, res: Response) => {
      try {
        const anchorId = req.params.anchorId
        const response: IServiceResponse<IAnchor> =
          await this.BackendAnchorGateway.getAnchorById(anchorId)
        res.status(200).send(response)
      } catch (e) {
        res.status(500).send(e.message)
      }
    })

    /**
     * Request to retrieve anchors by nodeId
     * TODO
     * @param req request object coming from client
     * @param res response object to send to client
     */
    AnchorExpressRouter.post('/getAnchorsById', async (req: Request, res: Response) => {
      ;async (req: Request, res: Response) => {
        try {
          const anchorIds = req.body.anchorIds
          const response: IServiceResponse<IAnchor[]> =
            await this.BackendAnchorGateway.getAnchorsById(anchorIds)
          res.status(200).send(response)
        } catch (e) {
          res.status(500).send(e.message)
        }
      }
    })

    /**
     * Request to retrieve anchors by nodeId
     * TODO
     * @param req request object coming from client
     * @param res response object to send to client
     */
    AnchorExpressRouter.get(
      '/getByNodeId/:nodeId',
      async (req: Request, res: Response) => {
        try {
          const nodeId = req.params.nodeId
          const response: IServiceResponse<IAnchor[]> =
            await this.BackendAnchorGateway.getAnchorsByNodeId(nodeId)
          res.status(200).send(response)
        } catch (e) {
          res.status(500).send(e.message)
        }
      }
    )

    /**
     * Request to delete the anchor with the given anchorId
     * @param req request object coming from client
     * @param res response object to send to client
     */
    AnchorExpressRouter.delete('/:anchorId', async (req: Request, res: Response) => {
      try {
        const anchorId = req.params.anchorId
        const response = await this.BackendAnchorGateway.deleteAnchor(anchorId)
        res.status(200).send(response)
      } catch (e) {
        res.status(500).send(e.message)
      }
    })

    /**
     * Request to delete the anchor with the given anchorId
     * @param req request object coming from client
     * @param res response object to send to client
     */
    AnchorExpressRouter.post('/delete', async (req: Request, res: Response) => {
      try {
        const anchorIds = req.body.anchorIds
        const response = await this.BackendAnchorGateway.deleteAnchors(anchorIds)
        res.status(200).send(response)
      } catch (e) {
        res.status(500).send(e.message)
      }
    })
  }

  /**
   * @returns AnchorRouter class
   */
  getExpressRouter = (): Router => {
    return AnchorExpressRouter
  }
}
