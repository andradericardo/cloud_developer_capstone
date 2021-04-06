import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createGrocerie, deleteGrocerie, getGroceries, patchGrocerie } from '../api/groceries-api'
import Auth from '../auth/Auth'
import { Grocerie } from '../types/Grocerie'

interface GroceriesProps {
  auth: Auth
  history: History
}

interface GroceriesState {
  groceries: Grocerie[]
  newGrocerieName: string
  loadingGroceries: boolean
}

export class Groceries extends React.PureComponent<GroceriesProps, GroceriesState> {
  state: GroceriesState = {
    groceries: [],
    newGrocerieName: '',
    loadingGroceries: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newGrocerieName: event.target.value })
  }

  onEditButtonClick = (grocerieId: string) => {
    this.props.history.push(`/groceries/${grocerieId}/edit`)
  }

  onGrocerieCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newGrocerie = await createGrocerie(this.props.auth.getIdToken(), {
        name: this.state.newGrocerieName,
        dueDate
      })
      this.setState({
        groceries: [...this.state.groceries, newGrocerie],
        newGrocerieName: ''
      })
    } catch {
      alert('Grocerie creation failed')
    }
  }

  onGrocerieDelete = async (grocerieId: string) => {
    try {
      await deleteGrocerie(this.props.auth.getIdToken(), grocerieId)
      this.setState({
        groceries: this.state.groceries.filter(grocerie => grocerie.grocerieId != grocerieId)
      })
    } catch {
      alert('Grocerie deletion failed')
    }
  }

  onGrocerieCheck = async (pos: number) => {
    try {
      const grocerie = this.state.groceries[pos]
      await patchGrocerie(this.props.auth.getIdToken(), grocerie.grocerieId, {
        name: grocerie.name,
        dueDate: grocerie.dueDate,
        done: !grocerie.done
      })
      this.setState({
        groceries: update(this.state.groceries, {
          [pos]: { done: { $set: !grocerie.done } }
        })
      })
    } catch {
      alert('Grocerie deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const groceries = await getGroceries(this.props.auth.getIdToken())
      this.setState({
        groceries,
        loadingGroceries: false
      })
    } catch (e) {
      alert(`Failed to fetch groceries: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Groceries</Header>

        {this.renderCreateGrocerieInput()}

        {this.renderGroceries()}
      </div>
    )
  }

  renderCreateGrocerieInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'Insert new grocery',
              onClick: this.onGrocerieCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Rice, beans, potatoes, soda, ..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderGroceries() {
    if (this.state.loadingGroceries) {
      return this.renderLoading()
    }

    return this.renderGroceriesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Groceries
        </Loader>
      </Grid.Row>
    )
  }

  renderGroceriesList() {
    return (
      <Grid padded>
        {this.state.groceries.map((grocerie, pos) => {
          return (
            <Grid.Row key={grocerie.grocerieId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onGrocerieCheck(pos)}
                  checked={grocerie.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {grocerie.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {grocerie.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(grocerie.grocerieId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onGrocerieDelete(grocerie.grocerieId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {grocerie.attachmentUrl && (
                <Image src={grocerie.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
