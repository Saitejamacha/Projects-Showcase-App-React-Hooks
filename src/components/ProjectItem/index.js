import {CourseList, Image, Text} from './styledComponents'

const ProjectItem = props => {
  const {projectItem} = props
  const {name, imageUrl} = projectItem

  return (
    <CourseList>
      <Image src={imageUrl} alt={name} />
      <Text>{name}</Text>
    </CourseList>
  )
}

export default ProjectItem
