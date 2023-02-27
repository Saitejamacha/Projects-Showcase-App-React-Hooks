import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'
import {HomeContainer, ProjectUnList, SelectBar} from './styledComponents'
import Header from '../Header'
import ProjectItem from '../ProjectItem'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstant = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const Projects = () => {
  const [projectCat, setProjectCat] = useState(categoriesList[0].id)
  const [TriggeredReryBtn, setRetryBtn] = useState(false)

  // console.log(projectCat)
  const [apiStatus, setApiStatus] = useState({
    status: apiStatusConstant.initial,
    data: null,
    errorMsg: null,
  })

  const onClickRetryBtn = () => {
    setRetryBtn(prevState => !prevState)
  }

  const onChangeSelectOption = event => {
    setProjectCat(event.target.value)
  }

  useEffect(() => {
    const getApiResponse = async () => {
      setApiStatus({
        status: apiStatusConstant.inProgress,
        data: null,
        errorMsg: null,
      })

      const url = `https://apis.ccbp.in/ps/projects?category=${projectCat}`
      const options = {
        methods: 'GET',
      }

      console.log(url)

      const response = await fetch(url, options)

      if (response.ok) {
        const data = await response.json()
        const formattedData = data.projects.map(eachProject => ({
          id: eachProject.id,
          imageUrl: eachProject.image_url,
          name: eachProject.name,
        }))

        setApiStatus(prevState => ({
          ...prevState,
          status: apiStatusConstant.success,
          data: formattedData,
        }))
      } else {
        setApiStatus(prevState => ({
          ...prevState,
          status: apiStatusConstant.failure,
          errorMsg: response.error_msg,
        }))
      }
    }

    getApiResponse()
  }, [projectCat, TriggeredReryBtn])

  const renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#00BFFF" height={60} width={80} />
    </div>
  )

  const renderSuccessView = () => {
    const {data} = apiStatus

    const projectsList = data.map(eachProject => (
      <ProjectItem projectItem={eachProject} key={eachProject.id} />
    ))

    return projectsList
  }

  const renderFailureView = () => (
    <div>
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <navigate to="/">
        <button onClick={onClickRetryBtn} type="button">
          Retry
        </button>
      </navigate>
    </div>
  )

  const renderRespectiveView = () => {
    const {status} = apiStatus

    switch (status) {
      case apiStatusConstant.inProgress:
        return renderLoadingView()
      case apiStatusConstant.success:
        return renderSuccessView()
      case apiStatusConstant.failure:
        return renderFailureView()
      default:
        return null
    }
  }

  return (
    <>
      <Header />
      <HomeContainer>
        <SelectBar onChange={onChangeSelectOption}>
          {categoriesList.map(eachOption => (
            <option value={eachOption.id} key={eachOption.id}>
              {eachOption.displayText}
            </option>
          ))}
        </SelectBar>

        <ProjectUnList>{renderRespectiveView()}</ProjectUnList>
      </HomeContainer>
    </>
  )
}

export default Projects
